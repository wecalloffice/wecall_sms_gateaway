# messaging/serializers.py

from rest_framework import serializers
from messaging.models import SmsMessage


class SmsSendSerializer(serializers.Serializer):
    to = serializers.CharField(help_text="Single phone or comma-separated list")
    message = serializers.CharField()
    senderId = serializers.CharField(max_length=11)

    country = serializers.CharField(
        max_length=3,
        required=False,
        help_text="Optional ISO country code for pricing, e.g. RWA",
    )
    operator = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=True,
        help_text="Optional operator name, e.g. MTN, Airtel",
    )


class SmsMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmsMessage
        fields = [
            "id",
            "business",
            "reseller",
            "direction",
            "sender",
            "recipient",
            "status",
            "error_code",
            "price",
            "currency",
            "gateway",
            "created_at",
            "delivered_at",
            "smpp_message_id",
            "text",
        ]
        read_only_fields = fields
