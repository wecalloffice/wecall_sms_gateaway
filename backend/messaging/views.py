# messaging/views.py

from decimal import Decimal
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.response import Response

from messaging.models import SmsMessage
from messaging.serializers import SmsSendSerializer, SmsMessageSerializer
from messaging.services.jasmin import send_sms_via_jasmin
from billing.services import charge_sms
from business.models import Business
from identity.models import User  # adjust if in another app


def is_platform_admin(user: User) -> bool:
    return getattr(user, "role", "").startswith("PLATFORM")


def is_reseller(user: User) -> bool:
    return getattr(user, "role", "").startswith("RESELLER")


def is_client(user: User) -> bool:
    return getattr(user, "role", "").startswith("CLIENT")


class SendSmsView(generics.GenericAPIView):
    """
    POST /api/v1/sms/send/

    Request JSON:
    {
      "to": "+250788123456,+250722999000",
      "message": "Hello world",
      "senderId": "ICYUZI",
      "country": "RWA",
      "operator": "MTN"  // optional
    }

    - Uses billing.charge_sms to deduct balance
    - Sends SMS via Jasmin (SMPP)
    - Records each SMS message in DB
    """
    serializer_class = SmsSendSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user: User = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        business = user.business
        reseller = business.parent if business.parent_id else None

        to_field = payload["to"]
        recipients = [p.strip() for p in to_field.split(",") if p.strip()]

        if not recipients:
            return Response(
                {"detail": "No valid recipients."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        message_text = payload["message"]
        sender_id = payload["senderId"][:11]

        country = payload.get("country") or "RWA"
        operator = payload.get("operator") or ""

        # Basic segment estimation: we can use len(message) and 160 chars/segment
        # For real multi-encoding, you'd want something more precise.
        def estimate_segments(text: str) -> int:
            length = len(text)
            if length <= 160:
                return 1
            # simple multi-part: 153 chars per part
            return (length + 152) // 153

        results = []
        total_segments = 0

        for recipient in recipients:
            segments = estimate_segments(message_text)
            total_segments += segments

            # 1) CHARGE wallet for this SMS
            try:
                sms_charge = charge_sms(
                    business=business,
                    segments=segments,
                    country=country,
                    operator=operator,
                    external_id=None,
                    created_by=user,
                )
            except Exception as e:
                # If one recipient fails due to insufficient balance,
                # you can decide to stop or skip. Here we stop and return error.
                return Response(
                    {"detail": f"Failed charging wallet for {recipient}: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 2) SEND via Jasmin SMPP
            try:
                smpp_id = send_sms_via_jasmin(
                    sender=sender_id,
                    recipient=recipient,
                    message_text=message_text,
                )
            except Exception as e:
                # Optionally, you could refund here if sending fails.
                return Response(
                    {"detail": f"Failed sending SMS to {recipient}: {str(e)}"},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            # 3) RECORD in DB
            sms = SmsMessage.objects.create(
                business=business,
                reseller=reseller,
                direction=SmsMessage.Direction.OUTBOUND,
                sender=sender_id,
                recipient=recipient,
                status=SmsMessage.Status.PENDING,
                price=sms_charge.total_amount,
                currency="RWF",
                gateway="jasmin",
                smpp_message_id=smpp_id,
                text=message_text,
            )

            results.append(SmsMessageSerializer(sms).data)

        return Response(
            {
                "count": len(results),
                "total_segments": total_segments,
                "messages": results,
            },
            status=status.HTTP_201_CREATED,
        )


class SmsDlrCallbackView(generics.GenericAPIView):
    """
    POST /api/v1/sms/dlr/

    This is called by Jasmin for delivery reports.

    You will configure Jasmin's HTTP DLR URL to point here.

    Typical Jasmin DLR parameters (depending on your routing):
      - id: SMPP message ID
      - stat or dlrstat: "DELIVRD", "UNDELIV", ...
      - err: error code

    Adjust this view to match your exact Jasmin configuration.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        msg_id = request.data.get("id") or request.data.get("message_id")
        status_text = request.data.get("stat") or request.data.get("dlrstat")
        error_code = request.data.get("err")  # optional

        if not msg_id:
            return Response({"detail": "Missing message id"}, status=400)

        sms = SmsMessage.objects.filter(smpp_message_id=msg_id).first()
        if not sms:
            return Response({"detail": "Unknown message"}, status=404)

        status_text = (status_text or "").upper()
        if status_text in ("DELIVRD", "DELIVERED"):
            sms.status = SmsMessage.Status.DELIVERED
            sms.delivered_at = timezone.now()
        else:
            sms.status = SmsMessage.Status.FAILED

        if error_code:
            sms.error_code = error_code

        sms.save(update_fields=["status", "delivered_at", "error_code"])
        return Response({"detail": "OK"}, status=200)


class SmsInboundCallbackView(generics.GenericAPIView):
    """
    POST /api/v1/sms/inbound/

    Called by Jasmin for incoming messages (MO).
    You'll configure Jasmin's HTTP MO URL to point here.

    Expected fields (depending on Jasmin setup):
      - from
      - to
      - text
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        sender = request.data.get("from")
        to = request.data.get("to")
        text = request.data.get("text")

        if not sender or not to:
            return Response({"detail": "Missing from/to"}, status=400)

        # Optionally, you can map 'to' to a specific Business by senderId/domain/etc.
        sms = SmsMessage.objects.create(
            business=None,  # or infer from 'to'
            reseller=None,
            direction=SmsMessage.Direction.INBOUND,
            sender=sender,
            recipient=to,
            status=SmsMessage.Status.DELIVERED,
            text=text or "",
        )

        return Response({"id": str(sms.id)}, status=201)
