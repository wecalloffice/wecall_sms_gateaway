
# identity/serializers.py

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from identity.models import UserSession

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.utils import timezone

from identity.models import User
from business.models import Business
from identity.emails import send_invite_email


# ============================================================
# 🔹 USER SERIALIZER (USED IN LOGIN & ME)
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    business_username = serializers.CharField(source="business.business_username", read_only=True)
    business_name = serializers.CharField(source="business.business_name", read_only=True)
    business_type = serializers.CharField(source="business.business_type", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "role",
            "business_username",
            "business_name",
            "business_type",
        )


# ============================================================
# 🔹 API KEY GENERATOR SERIALIZER
# ============================================================
class ApiKeyGenerateSerializer(serializers.Serializer):
    api_key = serializers.CharField(read_only=True)

    def create(self, validated_data):
        user = self.context["request"].user
        key = user.generate_api_key()
        return {"api_key": key}

class DomainLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.utils import timezone

        request = self.context.get("request")
        business = getattr(request, "business", None)

        if not business:
            raise serializers.ValidationError({"detail": "Unknown business domain."})

        username = attrs.get("username")
        password = attrs.get("password")

        # Try to load the user under this business
        try:
            user = User.objects.get(business=business, username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "Invalid username for this business."})

        # Account status checks
        if user.locked_until and user.locked_until > timezone.now():
            raise serializers.ValidationError({"detail": "Account locked. Try later."})

        if not user.is_email_verified:
            raise serializers.ValidationError({"detail": "Email not verified."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "User disabled."})

        if not user.check_password(password):
            user.register_failed_login()
            raise serializers.ValidationError({"password": "Incorrect password."})

        # Success
        user.clear_login_failures()

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        access["role"] = user.role
        access["business_id"] = str(user.business_id)
        access["business_username"] = user.business.business_username
        access["business_type"] = user.business.business_type

        # store session
        refresh_jti = refresh["jti"]
        UserSession.objects.create(
            user=user,
            business=business,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            device=request.META.get("HTTP_DEVICE", "unknown"),
            refresh_jti=refresh_jti,
        )

        return {
            "refresh": str(refresh),
            "access": str(access),
            "user": UserSerializer(user).data,
        }


# ============================================================
# 🔹 SETUP PASSWORD SERIALIZER (INVITE FLOW)
# ============================================================
class SetupPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, attrs):
        uidb64 = attrs.get("uidb64")
        token = attrs.get("token")
        username = attrs.get("username")
        password = attrs.get("password")
        password2 = attrs.get("password2")

        # Password match
        if password != password2:
            raise serializers.ValidationError({"password2": "Passwords do not match."})

        # Decode user ID
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            raise serializers.ValidationError({"uidb64": "Invalid or expired link."})

        # Token check
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": "Invalid or expired token."})

        if user.is_email_verified:
            raise serializers.ValidationError({"detail": "Account already activated."})

        # Username uniqueness inside the business
        if User.objects.filter(business=user.business, username=username).exclude(pk=user.pk).exists():
            raise serializers.ValidationError({"username": "This username is taken inside this business."})

        # Strong password validation
        validate_password(password, user=user)

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        username = self.validated_data["username"]
        password = self.validated_data["password"]

        user.username = username
        user.set_password(password)
        user.is_email_verified = True
        user.invited_at = user.invited_at or timezone.now()
        user.clear_login_failures()

        user.save(update_fields=[
            "username", "password", "is_email_verified",
            "invited_at", "failed_login_attempts", "locked_until"
        ])

        # Return login tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        access["role"] = user.role
        access["business_id"] = str(user.business_id)
        access["business_username"] = user.business.business_username
        access["business_type"] = user.business.business_type

        return {
            "user": UserSerializer(user).data,
            "access": str(access),
            "refresh": str(refresh),
        }


# ============================================================
# 🔹 RESEND INVITE
# ============================================================
class ResendInviteSerializer(serializers.Serializer):
    business_username = serializers.SlugField()
    email = serializers.EmailField()

    def validate(self, attrs):
        business_username = attrs["business_username"]
        email = attrs["email"]

        # Validate business
        try:
            business = Business.objects.get(business_username=business_username, is_active=True)
        except Business.DoesNotExist:
            raise serializers.ValidationError({"business_username": "Business not found or inactive."})

        # Validate user
        try:
            user = User.objects.get(business=business, email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found under this business."})

        if user.is_email_verified:
            raise serializers.ValidationError({"detail": "User already verified."})

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.invited_at = timezone.now()
        user.save(update_fields=["invited_at"])
        send_invite_email(user)
        return {"message": "Invite email resent successfully."}
    
 
# class BusinessLoginSerializer(serializers.Serializer):
#     """
#     Login with:
#       - username
#       - password
#     Business is resolved from domain by BusinessMiddleware (request.business)
#     """
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, attrs):
#         request = self.context.get("request")
#         if request is None:
#             raise serializers.ValidationError({"detail": "Request context is missing."})

#         username = attrs.get("username")
#         password = attrs.get("password")

#         # Business context from middleware
#         business = getattr(request, "business", None)
#         if business is None:
#             # For now: require business from middleware; later you can allow global login
#             raise serializers.ValidationError({
#                 "detail": "No business context found for this domain."
#             })

#         # ---- Load user ----
#         try:
#             user = User.objects.get(business=business, username=username)
#         except User.DoesNotExist:
#             # Defensive: never expose which field is wrong
#             raise serializers.ValidationError({
#                 "username": "Invalid username or password."
#             })

#         # ---- Security checks ----
#         # Account lockout
#         if user.locked_until and user.locked_until > timezone.now():
#             raise serializers.ValidationError({
#                 "detail": "This account is temporarily locked due to failed logins. Try again later."
#             })

#         if not user.is_email_verified:
#             raise serializers.ValidationError({
#                 "detail": "Email not verified. Check your inbox or request a new invite."
#             })

#         if not user.is_active:
#             raise serializers.ValidationError({
#                 "detail": "User account is inactive."
#             })

#         # ---- Password check ----
#         if not user.check_password(password):
#             user.register_failed_login()
#             raise serializers.ValidationError({
#                 "username": "Invalid username or password."
#             })

#         # Success → clear failures
#         user.clear_login_failures()

#         # ---- Issue tokens ----
#         refresh = RefreshToken.for_user(user)
#         access = refresh.access_token

#         # Add custom claims
#         access["role"] = user.role
#         access["business_id"] = str(user.business_id)
#         access["business_username"] = user.business.business_username
#         access["business_type"] = user.business.business_type

#         # (optional) You can log session here or in a separate place

#         return {
#             "refresh": str(refresh),
#             "access": str(access),
#             "user": UserSerializer(user).data,
#         }

class BusinessLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.utils import timezone

        username = attrs.get("username")
        password = attrs.get("password")

        # 1. Business is identified by the same username field
        try:
            business = Business.objects.get(business_username=username, is_active=True)
        except Business.DoesNotExist:
            raise serializers.ValidationError({
                "username": "Business not found or inactive."
            })

        # 2. A user must also exist with the SAME username under this business
        try:
            user = User.objects.get(business=business, username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "username": "User not found for this business."
            })

        # 3. Account lock check
        if user.locked_until and user.locked_until > timezone.now():
            raise serializers.ValidationError({
                "detail": "Account locked due to failed attempts. Try later."
            })

        if not user.is_email_verified:
            raise serializers.ValidationError({
                "detail": "Email not verified."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "detail": "User account is inactive."
            })

        # 4. Validate password
        if not user.check_password(password):
            user.register_failed_login()
            raise serializers.ValidationError({
                "password": "Incorrect password."
            })

        # 5. Password OK → clear fails
        user.clear_login_failures()

        # 6. JWT creation
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        access["role"]             = user.role
        access["business_id"]      = str(user.business_id)
        access["business_username"]= business.business_username
        access["business_type"]    = business.business_type

        # 7. Record a session (security)
        from identity.models import UserSession
        refresh_jti = refresh["jti"]

        UserSession.objects.create(
            user=user,
            device=self.context["request"].META.get("HTTP_DEVICE", "unknown"),
            ip_address=self.context["request"].META.get("REMOTE_ADDR"),
            user_agent=self.context["request"].META.get("HTTP_USER_AGENT", ""),
            refresh_jti=refresh_jti,
        )

        return {
            "refresh": str(refresh),
            "access": str(access),
            "user": UserSerializer(user).data,
        }
