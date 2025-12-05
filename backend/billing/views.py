

# from decimal import Decimal

# from django.db.models import Sum
# from django.shortcuts import get_object_or_404

# from rest_framework import generics, permissions, status, viewsets, mixins
# from rest_framework.decorators import action
# from rest_framework.response import Response

# from billing.models import (
#     Wallet,
#     Transaction,
#     SmsPrice,
#     ResellerCommission,
#     CommissionRecord,
#     SmsCharge,
# )
# from billing.serializers import (
#     WalletSerializer,
#     TransactionSerializer,
#     AdminTopUpSerializer,
#     SelfTopUpSerializer,
#     ChargeWalletSerializer,
#     SmsPriceSerializer,
#     ResellerCommissionSerializer,
#     CommissionRecordSerializer,
#     RevenueSummarySerializer,
# )
# from billing.services import ensure_wallet, charge_sms
# from business.models import Business
# from identity.models import User  # adjust import if needed


# # ---------- Role helpers ---------- #

# def is_platform_admin(user: User) -> bool:
#     return getattr(user, "role", "") == "PLATFORM_ADMIN"


# def is_reseller(user: User) -> bool:
#     return getattr(user, "role", "").startswith("RESELLER")


# def is_client(user: User) -> bool:
#     return getattr(user, "role", "").startswith("CLIENT")


# def can_self_topup(user: User) -> bool:
#     return is_reseller(user) or is_client(user)


# # ---------- Wallet APIs ---------- #

# class WalletDetailView(generics.RetrieveAPIView):
#     """
#     GET /billing/wallet/
#     - CLIENT/RESELLER: own wallet
#     - PLATFORM_ADMIN: can pass ?business_id=...
#     """
#     serializer_class = WalletSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self):
#         user: User = self.request.user
#         business_id = self.request.query_params.get("business_id")

#         if business_id and is_platform_admin(user):
#             business = get_object_or_404(Business, id=business_id)
#         else:
#             business = user.business

#         return ensure_wallet(business)


# class AdminTopUpView(generics.CreateAPIView):
#     """
#     POST /billing/topup/admin/
#     PLATFORM_ADMIN can top up any business.
#     """
#     serializer_class = AdminTopUpSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         user: User = request.user
#         if not is_platform_admin(user):
#             return Response(
#                 {"detail": "Only platform admins can perform admin top-ups."},
#                 status=status.HTTP_403_FORBIDDEN,
#             )
#         return super().post(request, *args, **kwargs)


# class SelfTopUpView(generics.CreateAPIView):
#     """
#     POST /billing/topup/self/
#     CLIENT or RESELLER can top up their own wallet.
#     """
#     serializer_class = SelfTopUpSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         user: User = request.user
#         if not can_self_topup(user):
#             return Response(
#                 {"detail": "Only clients and resellers can top up their own wallet."},
#                 status=status.HTTP_403_FORBIDDEN,
#             )
#         return super().post(request, *args, **kwargs)


# class TransactionListView(generics.ListAPIView):
#     """
#     GET /billing/transactions/
#     - CLIENT/RESELLER: own business transactions
#     - PLATFORM_ADMIN: can pass ?business_id=...
#     """
#     serializer_class = TransactionSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user: User = self.request.user
#         business_id = self.request.query_params.get("business_id")

#         if business_id and is_platform_admin(user):
#             business = get_object_or_404(Business, id=business_id)
#         else:
#             business = user.business

#         wallet = ensure_wallet(business)
#         return wallet.transactions.select_related("wallet", "created_by")


# # ---------- SMS Charge (used by SMS engine / internal) ---------- #

# class ChargeWalletView(generics.GenericAPIView):
#     """
#     POST /billing/charge/
#     Deduct wallet for SMS and register commissions.

#     Body:
#     {
#       "business_id": "...",
#       "segments": 2,
#       "country": "RWA",
#       "operator": "MTN",
#       "external_reference": "sms_123"
#     }
#     """
#     serializer_class = ChargeWalletSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         user: User = request.user

#         # You can tighten this rule as needed;
#         # typically platform or internal services would call this.
#         if not (is_platform_admin(user) or is_reseller(user)):
#             return Response(
#                 {"detail": "You are not allowed to charge wallets directly."},
#                 status=status.HTTP_403_FORBIDDEN,
#             )

#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         business: Business = serializer.validated_data["business_id"]
#         segments = serializer.validated_data["segments"]
#         country = serializer.validated_data["country"]
#         operator = serializer.validated_data.get("operator") or ""
#         ext_ref = serializer.validated_data.get("external_reference") or ""

#         try:
#             sms_charge = charge_sms(
#                 business=business,
#                 segments=segments,
#                 country=country,
#                 operator=operator,
#                 external_id=ext_ref,
#                 created_by=user,
#             )
#         except ValidationError as e:
#             return Response(
#                 {"detail": e.message},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         except ValueError as e:
#             # Includes "Insufficient wallet balance."
#             return Response(
#                 {"detail": str(e)},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         return Response(
#             {
#                 "business_id": str(business.id),
#                 "segments": segments,
#                 "country": country,
#                 "operator": operator,
#                 "total_amount": str(sms_charge.total_amount),
#                 "sms_charge_id": str(sms_charge.id),
#             },
#             status=status.HTTP_201_CREATED,
#         )


# # ---------- SMS Pricing Management ---------- #

# class SmsPriceViewSet(
#     mixins.ListModelMixin,
#     mixins.CreateModelMixin,
#     mixins.UpdateModelMixin,
#     viewsets.GenericViewSet,
# ):
#     """
#     /billing/sms-prices/
#     - PLATFORM_ADMIN: manage all SMS prices
#     - Non-admin: see only prices for their own business
#     """
#     queryset = SmsPrice.objects.all().select_related("business")
#     serializer_class = SmsPriceSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user: User = self.request.user
#         qs = super().get_queryset()
#         if is_platform_admin(user):
#             return qs
#         return qs.filter(business=user.business)


# # ---------- Commission Management & Revenue Views ---------- #

# class ResellerCommissionViewSet(
#     mixins.ListModelMixin,
#     mixins.CreateModelMixin,
#     mixins.UpdateModelMixin,
#     viewsets.GenericViewSet,
# ):
#     """
#     /billing/commissions/
#     - PLATFORM_ADMIN: manage any parent/child commission
#     - RESELLER: manage commissions where parent = their business
#     """
#     queryset = ResellerCommission.objects.all().select_related("parent", "child")
#     serializer_class = ResellerCommissionSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user: User = self.request.user
#         qs = super().get_queryset()
#         if is_platform_admin(user):
#             return qs
#         if is_reseller(user):
#             return qs.filter(parent=user.business)
#         return qs.none()

#     def perform_create(self, serializer):
#         user: User = self.request.user
#         parent = serializer.validated_data["parent"]
#         if not (is_platform_admin(user) or parent == user.business):
#             raise permissions.PermissionDenied("You can only set commissions for your own children.")
#         serializer.save()

#     def perform_update(self, serializer):
#         self.perform_create(serializer)


# class CommissionRevenueView(generics.ListAPIView):
#     """
#     GET /billing/revenue/commissions/
#     - PLATFORM_ADMIN: sees ALL commission records
#     - RESELLER: sees only their own commission earnings
#     """
#     serializer_class = CommissionRecordSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user: User = self.request.user
#         qs = CommissionRecord.objects.select_related(
#             "reseller", "from_business", "sms_charge"
#         )

#         if is_platform_admin(user):
#             return qs
#         if is_reseller(user):
#             return qs.filter(reseller=user.business)
#         return qs.none()


# class RevenueSummaryView(generics.GenericAPIView):
#     """
#     GET /billing/revenue/summary/
#     - PLATFORM_ADMIN:
#         total_sms_revenue = sum of all SmsCharge.total_amount
#         total_commissions_paid = sum of all CommissionRecord.amount
#         total_revenue = total_sms_revenue - total_commissions_paid
#     - RESELLER:
#         total_revenue = total_commissions_paid to this reseller
#         total_sms_revenue = 0 (not needed)
#     - CLIENT:
#         all zeros (no commission earnings)
#     """
#     serializer_class = RevenueSummarySerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         user: User = request.user

#         if is_platform_admin(user):
#             total_sms_revenue = SmsCharge.objects.aggregate(
#                 s=Sum("total_amount")
#             )["s"] or Decimal("0")
#             total_commissions_paid = CommissionRecord.objects.aggregate(
#                 s=Sum("amount")
#             )["s"] or Decimal("0")
#             total_revenue = total_sms_revenue - total_commissions_paid

#         elif is_reseller(user):
#             total_commissions_paid = CommissionRecord.objects.filter(
#                 reseller=user.business
#             ).aggregate(s=Sum("amount"))["s"] or Decimal("0")
#             total_sms_revenue = Decimal("0")
#             total_revenue = total_commissions_paid

#         else:
#             # Clients don't earn commission in this model
#             total_sms_revenue = Decimal("0")
#             total_commissions_paid = Decimal("0")
#             total_revenue = Decimal("0")

#         data = {
#             "total_revenue": total_revenue,
#             "total_sms_revenue": total_sms_revenue,
#             "total_commissions_paid": total_commissions_paid,
#         }
#         serializer = self.get_serializer(data)
#         return Response(serializer)

# billing/views.py

from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response

from billing.models import Wallet, Transaction, SmsPrice, ResellerCommission, CommissionRecord
from billing.serializers import (
    WalletSerializer, TransactionSerializer,
    AdminTopUpSerializer, SelfTopUpSerializer,
    SmsPriceSerializer, ResellerCommissionSerializer
)
from billing.services import charge_sms
from business.models import Business
from identity.models import User


def is_admin(user): return user.role.startswith("PLATFORM")
def is_reseller(user): return user.role.startswith("RESELLER")
def is_client(user): return user.role.startswith("CLIENT")


# WALLET DETAIL
class WalletDetailView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        business = self.request.user.business
        wallet, _ = Wallet.objects.get_or_create(business=business)
        return wallet


# SELF TOP-UP
class SelfTopUpView(generics.CreateAPIView):
    serializer_class = SelfTopUpSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not (is_client(request.user) or is_reseller(request.user)):
            return Response({"detail": "Only CLIENT or RESELLER can self-topup"}, status=403)
        return super().post(request, *args, **kwargs)


# ADMIN TOP-UP
class AdminTopUpView(generics.CreateAPIView):
    serializer_class = AdminTopUpSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not is_admin(request.user):
            return Response({"detail": "Only admin can topup others"}, status=403)
        return super().post(request, *args, **kwargs)


# TRANSACTIONS
class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        wallet, _ = Wallet.objects.get_or_create(business=self.request.user.business)
        return wallet.transactions.all()


# SMS CHARGING
class ChargeWalletView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        business = Business.objects.get(id=data["business_id"])

        try:
            charge = charge_sms(
                business=business,
                segments=data["segments"],
                country=data["country"],
                operator=data.get("operator", ""),
                external_id=data.get("external_reference", "")
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

        return Response({"success": True, "amount": str(charge.total_amount)})
