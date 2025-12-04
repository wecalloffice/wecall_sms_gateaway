# identity/emails.py
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


def build_setup_password_url(user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # Frontend base URL (set in settings)
    base_url = getattr(settings, "FRONTEND_BASE_URL", "http://127.0.0.1:8000")

    # Example route: /auth/setup/<uidb64>/<token>/
    return f"{base_url}/auth/setup/{uidb64}/{token}/"


def send_invite_email(user):
    """
    Sends an email to the user with a "verify & set password" link.
    """
    setup_url = build_setup_password_url(user)
    subject = "Complete your WeCallSMS account setup"
    message = (
        f"Hello,\n\n"
        f"You have been invited to access WeCallSMS for business '{user.business.business_name}'.\n\n"
        f"Please click the link below to verify your email and create your login credentials:\n\n"
        f"{setup_url}\n\n"
        f"If you did not expect this email, you can safely ignore it.\n\n"
        f"Best regards,\n"
        f"WeCallSMS Team"
    )

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@wecallsms.rw")
    send_mail(subject, message, from_email, [user.email], fail_silently=False)
