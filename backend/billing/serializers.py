

# from decimal import Decimal

# from rest_framework import serializers

# from billing.models import (
#     Wallet,
#     Transaction,
#     WalletTopUp,
#     SmsPrice,
#     ResellerCommission,
#     CommissionRecord,
# )
# from billing.services import topup_wallet, validate_commission_for_child
# from business.models import Business


# class WalletSerializer(serializers.ModelSerializer):
#     business_id = serializers.UUIDField(source="business.id", read_only=True)
#     business_name = serializers.CharField(source="business.business_name", read_only=True)

#     class Meta:
#         model = Wallet
#         fields = [
#             "id",
#             "business_id",
#             "business_name",
#             "balance",
#             "reserved_balance",
#             "currency",
#             "is_active",
#             "created_at",
#             "updated_at",
#         ]


# class TransactionSerializer(serializers.ModelSerializer):
#     business_name = serializers.CharField(source="wallet.business.business_name", read_only=True)

#     class Meta:
#         model = Transaction
#         fields = [
#             "id",
#             "tx_type",
#             "amount",
#             "balance_after",
#             "description",
#             "external_reference",
#             "meta",
#             "business_name",
#             "created_by",
#             "created_at",
#         ]
#         read_only_fields = fields


# class AdminTopUpSerializer(serializers.Serializer):
#     business_id = serializers.UUIDField()
#     amount = serializers.DecimalField(max_digits=12, decimal_places=2)
#     notes = serializers.CharField(required=False, allow_blank=True)

#     def validate_business_id(self, value):
#         try:
#             return Business.objects.get(id=value, is_active=True)
#         except Business.DoesNotExist:
#             raise serializers.ValidationError("Business not found or inactive.")

#     def create(self, validated_data):
#         request = self.context["request"]
#         business = validated_data["business_id"]
#         amount = validated_data["amount"]
#         notes = validated_data.get("notes", "")

#         result = topup_wallet(
#             business=business,
#             amount=Decimal(amount),
#             source=WalletTopUp.Source.ADMIN,
#             created_by=request.user,
#             notes=notes,
#         )
#         WalletTopUp.objects.create(
#             business=business,
#             amount=amount,
#             source=WalletTopUp.Source.ADMIN,
#             created_by=request.user,
#             notes=notes,
#         )
#         return result


# class SelfTopUpSerializer(serializers.Serializer):
#     """
#     Used by CLIENT and RESELLER to top up their own wallet.
#     """
#     amount = serializers.DecimalField(max_digits=12, decimal_places=2)
#     notes = serializers.CharField(required=False, allow_blank=True)

#     def create(self, validated_data):
#         request = self.context["request"]
#         business = request.user.business
#         amount = validated_data["amount"]
#         notes = validated_data.get("notes", "")

#         result = topup_wallet(
#             business=business,
#             amount=Decimal(amount),
#             source=WalletTopUp.Source.CLIENT,  # also used for RESELLER self-topup
#             created_by=request.user,
#             notes=notes,
#         )
#         WalletTopUp.objects.create(
#             business=business,
#             amount=amount,
#             source=WalletTopUp.Source.CLIENT,
#             created_by=request.user,
#             notes=notes,
#         )
#         return result


# class ChargeWalletSerializer(serializers.Serializer):
#     """
#     Used by internal SMS engine to charge wallet.
#     """
#     business_id = serializers.UUIDField()
#     segments = serializers.IntegerField(min_value=1)
#     country = serializers.CharField(max_length=3)
#     operator = serializers.CharField(max_length=50, required=False, allow_blank=True)
#     external_reference = serializers.CharField(required=False, allow_blank=True)

#     def validate_business_id(self, value):
#         try:
#             return Business.objects.get(id=value, is_active=True)
#         except Business.DoesNotExist:
#             raise serializers.ValidationError("Business not found or inactive.")


# class SmsPriceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SmsPrice
#         fields = [
#             "id",
#             "business",
#             "country",
#             "operator",
#             "price_per_unit",
#             "is_active",
#             "created_at",
#             "updated_at",
#         ]
#         read_only_fields = ["id", "created_at", "updated_at"]


# class ResellerCommissionSerializer(serializers.ModelSerializer):
#     parent_name = serializers.CharField(source="parent.business_name", read_only=True)
#     child_name = serializers.CharField(source="child.business_name", read_only=True)

#     class Meta:
#         model = ResellerCommission
#         fields = [
#             "id",
#             "parent",
#             "parent_name",
#             "child",
#             "child_name",
#             "commission_percent",
#             "is_active",
#         ]

#     def validate(self, attrs):
#         parent = attrs["parent"]
#         percent = attrs["commission_percent"]
#         validate_commission_for_child(parent=parent, child_percent=percent)
#         return attrs


# class CommissionRecordSerializer(serializers.ModelSerializer):
#     reseller_name = serializers.CharField(source="reseller.business_name", read_only=True)
#     from_business_name = serializers.CharField(source="from_business.business_name", read_only=True)

#     class Meta:
#         model = CommissionRecord
#         fields = [
#             "id",
#             "reseller",
#             "reseller_name",
#             "from_business",
#             "from_business_name",
#             "sms_charge",
#             "amount",
#             "created_at",
#         ]


# class RevenueSummarySerializer(serializers.Serializer):
#     total_revenue = serializers.DecimalField(max_digits=18, decimal_places=4)
#     total_sms_revenue = serializers.DecimalField(max_digits=18, decimal_places=4)
#     total_commissions_paid = serializers.DecimalField(max_digits=18, decimal_places=4)
# billing/serializers.py

from rest_framework import serializers
from decimal import Decimal

from billing.models import (
    Wallet, Transaction, SmsPrice,
    ResellerCommission, CommissionRecord
)
from billing.services import topup_wallet, validate_commission
from business.models import Business


class WalletSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source="business.business_name", read_only=True)

    class Meta:
        model = Wallet
        fields = ["id", "business", "business_name", "balance", "reserved_balance", "currency"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


class AdminTopUpSerializer(serializers.Serializer):
    business_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_business_id(self, val):
        return Business.objects.get(id=val)

    def create(self, data):
        request = self.context["request"]
        business = data["business_id"]
        tx = topup_wallet(
            business=business,
            amount=data["amount"],
            source="ADMIN",
            created_by=request.user,
            notes=data.get("notes", "")
        )
        return TransactionSerializer(tx).data


class SelfTopUpSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    notes = serializers.CharField(required=False, allow_blank=True)

    def create(self, data):
        user = self.context["request"].user
        tx = topup_wallet(
            business=user.business,
            amount=data["amount"],
            source="SELF",
            created_by=user,
            notes=data.get("notes", "")
        )
        return TransactionSerializer(tx).data


class SmsPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmsPrice
        fields = "__all__"


class ResellerCommissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResellerCommission
        fields = "__all__"

    def validate(self, attrs):
        validate_commission(attrs["parent"], attrs["commission_percent"])
        return attrs
