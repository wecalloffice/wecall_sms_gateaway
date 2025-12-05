
# import uuid
# from decimal import Decimal

# from django.conf import settings
# from django.db import models
# from django.utils import timezone
# from business.models import Business

# User = settings.AUTH_USER_MODEL


# class Wallet(models.Model):
#     """
#     One wallet per Business.
#     Holds available balance in RWF (for now).
#     """
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     business = models.OneToOneField(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="wallet",
#     )

#     balance = models.DecimalField(
#         max_digits=18,
#         decimal_places=4,
#         default=Decimal("0.0000"),
#     )
#     reserved_balance = models.DecimalField(
#         max_digits=18,
#         decimal_places=4,
#         default=Decimal("0.0000"),
#         help_text="Amount reserved for pending SMS / operations.",
#     )
#     currency = models.CharField(max_length=10, default="RWF")
#     is_active = models.BooleanField(default=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         verbose_name = "Wallet"
#         verbose_name_plural = "Wallets"

#     def __str__(self):
#         return f"Wallet({self.business.business_name}) — {self.balance} {self.currency}"

#     def can_debit(self, amount: Decimal) -> bool:
#         return self.is_active and (self.balance - amount) >= Decimal("0.0")


# class Transaction(models.Model):
#     """
#     Every money movement in/out of a wallet.
#     """
#     class TxType(models.TextChoices):
#         TOPUP = "TOPUP", "Top up"
#         SMS_DEBIT = "SMS_DEBIT", "SMS debit"
#         ADJUSTMENT = "ADJUSTMENT", "Manual adjustment"
#         COMMISSION = "COMMISSION", "Commission earned"

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     wallet = models.ForeignKey(
#         Wallet,
#         on_delete=models.CASCADE,
#         related_name="transactions",
#     )
#     tx_type = models.CharField(max_length=20, choices=TxType.choices)
#     amount = models.DecimalField(
#         max_digits=18,
#         decimal_places=4,
#         help_text="Positive for credit, negative for debit.",
#     )
#     balance_after = models.DecimalField(
#         max_digits=18,
#         decimal_places=4,
#         help_text="Wallet balance right after this transaction.",
#     )

#     description = models.TextField(blank=True)
#     external_reference = models.CharField(
#         max_length=255,
#         blank=True,
#         help_text="Optional reference to payment gateway, SMS message id, etc.",
#     )
#     meta = models.JSONField(
#         blank=True,
#         null=True,
#         help_text="Extra JSON metadata (e.g., SMS ID, route, campaign id).",
#     )

#     created_by = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="billing_transactions",
#     )
#     created_at = models.DateTimeField(default=timezone.now)

#     class Meta:
#         verbose_name = "Transaction"
#         verbose_name_plural = "Transactions"
#         ordering = ["-created_at"]

#     def __str__(self):
#         return f"{self.tx_type} {self.amount} on {self.wallet.business.business_name}"


# class SmsPrice(models.Model):
#     """
#     Price per SMS unit.
#     - If business is null → platform default
#     - Otherwise → per-business override
#     """
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

#     business = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True,
#         related_name="sms_prices",
#         help_text="Null = global default pricing.",
#     )
#     country = models.CharField(
#         max_length=3,
#         help_text="ISO country code (e.g. 'RWA').",
#     )
#     operator = models.CharField(
#         max_length=50,
#         blank=True,
#         help_text="Optional operator name (e.g. 'MTN', 'Airtel').",
#     )
#     price_per_unit = models.DecimalField(
#         max_digits=12,
#         decimal_places=4,
#         help_text="Price per SMS unit in RWF.",
#     )
#     is_active = models.BooleanField(default=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         verbose_name = "SMS Price"
#         verbose_name_plural = "SMS Prices"
#         indexes = [
#             models.Index(fields=["business", "country", "operator"]),
#         ]

#     def __str__(self):
#         scope = self.business.business_name if self.business else "GLOBAL"
#         return f"{scope} {self.country}/{self.operator or '*'} → {self.price_per_unit} RWF"


# class WalletTopUp(models.Model):
#     """
#     Logical record of a top-up action (who topped up whom and how).
#     """
#     class Source(models.TextChoices):
#         ADMIN = "ADMIN"
#         RESELLER = "RESELLER"
#         CLIENT = "CLIENT"
#         PAYMENT = "PAYMENT"  # momo, visa, bank, etc.

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     business = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="topups",
#     )
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     source = models.CharField(max_length=20, choices=Source.choices)
#     created_by = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="topup_created",
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     notes = models.TextField(blank=True)

#     def __str__(self):
#         return f"TopUp {self.amount} → {self.business.business_name} ({self.source})"


# class SmsCharge(models.Model):
#     """
#     Record of a charged SMS batch (for revenue reporting).
#     """
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     business = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="sms_charges",
#     )
#     segments = models.PositiveIntegerField()
#     country = models.CharField(max_length=3)
#     operator = models.CharField(max_length=50, blank=True)
#     unit_price = models.DecimalField(max_digits=12, decimal_places=4)
#     total_amount = models.DecimalField(max_digits=18, decimal_places=4)
#     external_reference = models.CharField(
#         max_length=255,
#         blank=True,
#         help_text="Message id / campaign id / external reference.",
#     )
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"SMS Charge {self.total_amount} from {self.business.business_name}"


# class ResellerCommission(models.Model):
#     """
#     Commission rule: parent (reseller or platform) earns X% of SMS revenue generated by child.
#     This supports multi-level:
#       Admin → MTN → Airtel → Liquid → Client
#     """
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     parent = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="commission_children",
#         help_text="The reseller / platform that earns commission.",
#     )
#     child = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="commission_parents",
#     )
#     commission_percent = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         help_text="Commission percent (e.g. 15.00 = 15%).",
#     )
#     is_active = models.BooleanField(default=True)

#     class Meta:
#         unique_together = ("parent", "child")

#     def __str__(self):
#         return f"{self.parent.business_name} → {self.child.business_name}: {self.commission_percent}%"


# class CommissionRecord(models.Model):
#     """
#     Actual money earned as commission for a given SMS charge.
#     """
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     reseller = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="commission_earnings",
#     )
#     from_business = models.ForeignKey(
#         Business,
#         on_delete=models.CASCADE,
#         related_name="commission_generated",
#     )
#     sms_charge = models.ForeignKey(
#         SmsCharge,
#         on_delete=models.CASCADE,
#         related_name="commission_records",
#     )
#     amount = models.DecimalField(max_digits=18, decimal_places=4)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.amount} commission for {self.reseller.business_name}"
# billing/models.py

import uuid
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils import timezone
from business.models import Business

User = settings.AUTH_USER_MODEL


class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name="wallet")

    balance = models.DecimalField(max_digits=18, decimal_places=4, default=Decimal("0.0000"))
    reserved_balance = models.DecimalField(max_digits=18, decimal_places=4, default=Decimal("0.0000"))
    currency = models.CharField(max_length=10, default="RWF")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_debit(self, amount: Decimal) -> bool:
        return self.is_active and (self.balance - amount) >= Decimal("0.0")

    def __str__(self):
        return f"Wallet({self.business.business_name})"


class Transaction(models.Model):
    class TxType(models.TextChoices):
        TOPUP = "TOPUP"
        SMS_DEBIT = "SMS_DEBIT"
        COMMISSION = "COMMISSION"
        ADJUSTMENT = "ADJUSTMENT"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")

    tx_type = models.CharField(max_length=20, choices=TxType.choices)
    amount = models.DecimalField(max_digits=18, decimal_places=4)
    balance_after = models.DecimalField(max_digits=18, decimal_places=4)

    description = models.TextField(blank=True)
    # external_reference = models.CharField(max_length=255, blank=True)
    external_reference = models.CharField(
    max_length=255,
    blank=True,
    null=True,   # ← REQUIRED
    help_text="Optional reference to payment gateway, SMS message id, etc.",
)

    meta = models.JSONField(blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tx_type} {self.amount}"


class SmsPrice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    business = models.ForeignKey(Business, on_delete=models.CASCADE, null=True, blank=True)
    country = models.CharField(max_length=3)
    operator = models.CharField(max_length=50, blank=True)

    price_per_unit = models.DecimalField(max_digits=12, decimal_places=4)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        owner = self.business.business_name if self.business else "GLOBAL"
        return f"{owner} {self.country}/{self.operator or '*'}"


class SmsCharge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)

    segments = models.IntegerField()
    country = models.CharField(max_length=3)
    operator = models.CharField(max_length=50, blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=4)
    total_amount = models.DecimalField(max_digits=18, decimal_places=4)

    external_reference = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ResellerCommission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    parent = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="commission_parent")
    child = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="commission_child")

    commission_percent = models.DecimalField(max_digits=5, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("parent", "child")

    def __str__(self):
        return f"{self.parent.business_name} → {self.child.business_name}"


class CommissionRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    reseller = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="commission_received")
    from_business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="commission_generated")

    sms_charge = models.ForeignKey(SmsCharge, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=18, decimal_places=4)

    created_at = models.DateTimeField(auto_now_add=True)
