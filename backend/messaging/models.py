# messaging/models.py

import uuid
from decimal import Decimal
from django.db import models
from django.utils import timezone
from business.models import Business


class SmsMessage(models.Model):
    class Direction(models.TextChoices):
        OUTBOUND = "outbound"
        INBOUND = "inbound"

    class Status(models.TextChoices):
        PENDING = "pending"
        DELIVERED = "delivered"
        FAILED = "failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # business that owns the message (sender business)
    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="sms_messages",
        null=True,
        blank=True,
    )

    # reseller (if exists) above the business
    reseller = models.ForeignKey(
        Business,
        on_delete=models.SET_NULL,
        related_name="reseller_sms_messages",
        null=True,
        blank=True,
    )

    direction = models.CharField(max_length=10, choices=Direction.choices)
    sender = models.CharField(max_length=64)      # maps to `from`
    recipient = models.CharField(max_length=64)   # maps to `to`

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    error_code = models.CharField(max_length=32, null=True, blank=True)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        null=True,
        blank=True,
        help_text="Total charge for this SMS (client cost).",
    )
    currency = models.CharField(max_length=16, default="RWF")

    gateway = models.CharField(max_length=64, default="jasmin")

    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    # SMPP message id from Jasmin
    smpp_message_id = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        help_text="Message ID returned by SMPP.",
    )

    # For inbound messages: store content
    text = models.TextField(blank=True)

    def __str__(self):
        return f"{self.direction.upper()} {self.sender} → {self.recipient} [{self.status}]"
