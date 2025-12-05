
# # billing/services.py

# from decimal import Decimal

# from django.core.exceptions import ValidationError
# from django.db import transaction

# from billing.models import (
#     Wallet,
#     Transaction,
#     SmsPrice,
#     SmsCharge,
#     ResellerCommission,
#     CommissionRecord,
# )
# from business.models import Business


# def ensure_wallet(business: Business) -> Wallet:
#     wallet, _ = Wallet.objects.get_or_create(business=business)
#     return wallet


# def get_wallet_for_update(business_id):
#     try:
#         return Wallet.objects.select_for_update().get(
#             business_id=business_id,
#             is_active=True,
#         )
#     except Wallet.DoesNotExist:
#         raise ValueError("Wallet not found or inactive.")


# def topup_wallet(
#     *,
#     business: Business,
#     amount: Decimal,
#     source: str,
#     created_by=None,
#     notes: str | None = None,
# ):
#     if amount <= 0:
#         raise ValueError("Top-up amount must be positive.")

#     with transaction.atomic():
#         wallet = get_wallet_for_update(business.id)

#         new_balance = wallet.balance + amount
#         wallet.balance = new_balance
#         wallet.save(update_fields=["balance", "updated_at"])

#         tx = Transaction.objects.create(
#             wallet=wallet,
#             tx_type=Transaction.TxType.TOPUP,
#             amount=amount,  # positive = credit
#             balance_after=new_balance,
#             description=notes or f"Top-up via {source}",
#             external_reference=None,
#             meta={"source": source},
#             created_by=created_by,
#         )

#     return {
#         "business_id": str(business.id),
#         "amount": amount,
#         "new_balance": new_balance,
#         "transaction_id": str(tx.id),
#     }


# def debit_wallet(
#     *,
#     business: Business,
#     amount: Decimal,
#     reason: str,
#     tx_type: Transaction.TxType = Transaction.TxType.ADJUSTMENT,
#     created_by=None,
#     external_ref=None,
#     meta=None,
# ):
#     if amount <= 0:
#         raise ValueError("Debit amount must be positive.")

#     with transaction.atomic():
#         wallet = get_wallet_for_update(business.id)

#         if wallet.balance < amount:
#             raise ValueError("Insufficient wallet balance.")

#         new_balance = wallet.balance - amount
#         wallet.balance = new_balance
#         wallet.save(update_fields=["balance", "updated_at"])

#         tx = Transaction.objects.create(
#             wallet=wallet,
#             tx_type=tx_type,
#             amount=-amount,  # negative = debit
#             balance_after=new_balance,
#             description=reason,
#             external_reference=external_ref,
#             meta=meta or {},
#             created_by=created_by,
#         )

#     return {
#         "business_id": str(business.id),
#         "amount": amount,
#         "new_balance": new_balance,
#         "transaction_id": str(tx.id),
#     }


# def _get_sms_unit_price_for_business(
#     *, business: Business, country: str, operator: str | None = ""
# ) -> Decimal:
#     """
#     Pricing resolution priority:
#     1) business & country & operator
#     2) business & country & operator=''
#     3) global (business=None) & country & operator
#     4) global (business=None) & country & operator=''
#     """
#     operator = operator or ""
#     qs = SmsPrice.objects.filter(
#         country=country,
#         is_active=True,
#     )

#     price_obj = (
#         qs.filter(business=business, operator=operator).first()
#         or qs.filter(business=business, operator="").first()
#         or qs.filter(business__isnull=True, operator=operator).first()
#         or qs.filter(business__isnull=True, operator="").first()
#     )
#     if not price_obj:
#         raise ValidationError("No SMS price configured for this route.")

#     return price_obj.price_per_unit


# def _get_max_commission_for_parent(parent: Business) -> Decimal:
#     """
#     Returns the maximum commission_percent that 'parent' can pass down.
#     If parent has a commission rule from its own parent, we use that commission_percent.
#     If not (top-level / admin), allow up to 100%.
#     """
#     parent_rule = ResellerCommission.objects.filter(
#         child=parent,
#         is_active=True,
#     ).first()
#     if parent_rule:
#         return parent_rule.commission_percent
#     return Decimal("100.00")


# def validate_commission_for_child(
#     *, parent: Business, child_percent: Decimal
# ):
#     max_allowed = _get_max_commission_for_parent(parent)
#     if child_percent > max_allowed:
#         raise ValidationError(
#             f"Child commission ({child_percent}%) cannot exceed parent commission ({max_allowed}%)."
#         )


# def _distribute_commissions(
#     *, client_business: Business, sms_charge: SmsCharge
# ):
#     """
#     Walk up the business.parent chain and credit commission to each reseller
#     according to ResellerCommission rules.
#     Example:
#       Admin (no parent) → MTN → Airtel → Liquid → Client
#     """
#     total_value = sms_charge.total_amount
#     current = client_business
#     visited = set()

#     while current.parent_id:
#         parent = current.parent
#         if parent.id in visited:
#             break
#         visited.add(parent.id)

#         rule = ResellerCommission.objects.filter(
#             parent=parent,
#             child=current,
#             is_active=True,
#         ).first()

#         if rule:
#             commission_amount = (total_value * rule.commission_percent) / Decimal("100.00")
#             if commission_amount > 0:
#                 with transaction.atomic():
#                     parent_wallet = ensure_wallet(parent)
#                     parent_wallet.balance += commission_amount
#                     parent_wallet.save(update_fields=["balance", "updated_at"])

#                     Transaction.objects.create(
#                         wallet=parent_wallet,
#                         tx_type=Transaction.TxType.COMMISSION,
#                         amount=commission_amount,
#                         balance_after=parent_wallet.balance,
#                         description=f"Commission from {current.business_name}",
#                         external_reference="",
#                         meta={"sms_charge_id": str(sms_charge.id)},
#                         created_by=None,
#                     )
#                     CommissionRecord.objects.create(
#                         reseller=parent,
#                         from_business=current,
#                         sms_charge=sms_charge,
#                         amount=commission_amount,
#                     )

#         current = parent


# def charge_sms(
#     *,
#     business: Business,
#     segments: int,
#     country: str,
#     operator: str | None = "",
#     external_id: str | None = None,
#     created_by=None,
# ) -> SmsCharge:
#     """
#     Deduct wallet when SMS is sent and register commissions.
#     Enforces balance: if business cannot pay, raises ValueError.
#     """
#     if segments <= 0:
#         raise ValueError("segments must be positive")

#     unit_price = _get_sms_unit_price_for_business(
#         business=business,
#         country=country,
#         operator=operator or "",
#     )
#     total_cost = unit_price * Decimal(segments)

#     with transaction.atomic():
#         # Debit client (or whoever is sending)
#         debit_wallet(
#             business=business,
#             amount=total_cost,
#             reason=f"SMS Charge ({segments} parts, {country}/{operator or '*'})",
#             tx_type=Transaction.TxType.SMS_DEBIT,
#             created_by=created_by,
#             external_ref=external_id,
#             meta={"segments": segments, "country": country, "operator": operator},
#         )

#         sms_charge = SmsCharge.objects.create(
#             business=business,
#             segments=segments,
#             country=country,
#             operator=operator or "",
#             unit_price=unit_price,
#             total_amount=total_cost,
#             external_reference=external_id or "",
#         )

#         # Now propagate commissions upwards
#         _distribute_commissions(client_business=business, sms_charge=sms_charge)

#     return sms_charge

# billing/services.py

# from curses import meta
from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from billing.models import (
    Wallet, Transaction, SmsPrice,
    SmsCharge, ResellerCommission, CommissionRecord
)
from business.models import Business


# SAFE wallet retrieval
def get_wallet_for_update(business_id):
    wallet, _ = Wallet.objects.select_for_update().get_or_create(
        business_id=business_id,
        defaults={"balance": 0, "reserved_balance": 0, "currency": "RWF"},
    )
    return wallet


# ---------------------------
# TOP UP
# ---------------------------
def topup_wallet(*, business, amount, source, created_by=None, notes=None):

    if amount <= 0:
        raise ValueError("Amount must be positive.")

    with transaction.atomic():
        wallet = get_wallet_for_update(business.id)

        new_balance = wallet.balance + amount
        wallet.balance = new_balance
        wallet.save(update_fields=["balance", "updated_at"])

        tx = Transaction.objects.create(
        wallet=wallet,
        tx_type=Transaction.TxType.SMS_DEBIT,
        amount=-amount,
        balance_after=new_balance,
        description=reason,
        external_reference=external_ref or "",   # ← FIX
        meta=meta or {},
        created_by=created_by,
    )


        return tx


# ---------------------------
# DEBIT (SMS COST)
# ---------------------------
def debit_wallet(*, business, amount, reason, created_by=None, external_ref=None, meta=None):

    if amount <= 0:
        raise ValueError("Debit amount must be positive.")

    with transaction.atomic():
        wallet = get_wallet_for_update(business.id)

        if wallet.balance < amount:
            raise ValueError("Insufficient wallet balance.")

        new_balance = wallet.balance - amount
        wallet.balance = new_balance
        wallet.save(update_fields=["balance", "updated_at"])

        tx = Transaction.objects.create(
            wallet=wallet,
            tx_type=Transaction.TxType.SMS_DEBIT,
            amount=-amount,
            balance_after=new_balance,
            description=reason,
            external_reference=external_ref,
            meta=meta or {},
            created_by=created_by,
        )

        return tx


# ---------------------------
# GET SMS PRICE
# ---------------------------
def resolve_sms_price(business, country, operator=""):
    qs = SmsPrice.objects.filter(country=country, is_active=True)

    operator = operator or ""

    return (
        qs.filter(business=business, operator=operator).first() or
        qs.filter(business=business, operator="").first() or
        qs.filter(business__isnull=True, operator=operator).first() or
        qs.filter(business__isnull=True, operator="").first()
    )


# ---------------------------
# COMMISSION LIMIT CHECK
# ---------------------------
def validate_commission(parent, child_percent):

    parent_rule = ResellerCommission.objects.filter(child=parent).first()
    max_allowed = parent_rule.commission_percent if parent_rule else Decimal("100.00")

    if child_percent > max_allowed:
        raise ValidationError(f"Child commission {child_percent}% > allowed {max_allowed}%")


# ---------------------------
# DISTRIBUTE COMMISSIONS UPWARD
# ---------------------------
def distribute_commissions(business, sms_charge):

    current = business

    while current.parent_id:
        parent = current.parent

        rule = ResellerCommission.objects.filter(
            parent=parent, child=current, is_active=True
        ).first()

        if rule:
            commission_amount = (sms_charge.total_amount * rule.commission_percent) / 100

            parent_wallet = get_wallet_for_update(parent.id)
            parent_wallet.balance += commission_amount
            parent_wallet.save()

            Transaction.objects.create(
                wallet=parent_wallet,
                tx_type=Transaction.TxType.COMMISSION,
                amount=commission_amount,
                balance_after=parent_wallet.balance,
                description=f"Commission from {current.business_name}",
            )

            CommissionRecord.objects.create(
                reseller=parent,
                from_business=current,
                sms_charge=sms_charge,
                amount=commission_amount,
            )

        current = parent


# ---------------------------
# CHARGE SMS
# ---------------------------
def charge_sms(*, business, segments, country, operator="", external_id=None, created_by=None):

    price_obj = resolve_sms_price(business, country, operator)
    if not price_obj:
        raise ValidationError("No SMS price configured.")

    total_cost = price_obj.price_per_unit * Decimal(segments)

    # Charge the wallet
    debit_wallet(
        business=business,
        amount=total_cost,
        reason=f"SMS Charge ({segments} segments)",
        created_by=created_by,
        external_ref=external_id,
        meta={"segments": segments, "country": country, "operator": operator},
    )

    sms_charge = SmsCharge.objects.create(
        business=business,
        segments=segments,
        country=country,
        operator=operator,
        unit_price=price_obj.price_per_unit,
        total_amount=total_cost,
        external_reference=external_id or "",
    )

    distribute_commissions(business, sms_charge)

    return sms_charge
