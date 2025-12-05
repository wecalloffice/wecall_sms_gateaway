
# business/serializers.py
from rest_framework import serializers
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password

from business.models import Business, BusinessBranding
from identity.models import User
from identity.emails import send_invite_email


# ============================================================
# GENERIC BUSINESS SERIALIZER
# ============================================================
class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = "__all__"


# ============================================================
# BUSINESS REGISTRATION (SELF-SIGNUP)
# ============================================================
class BusinessRegistrationSerializer(serializers.Serializer):
    business_username = serializers.SlugField(max_length=60)
    business_name = serializers.CharField(max_length=200)
    business_type = serializers.ChoiceField(choices=Business.BusinessType.choices)

    contact_person = serializers.CharField(max_length=200)
    contact_email = serializers.EmailField()
    contact_phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)

    # ❌ No password here — user will set it via invite link

    def validate_business_username(self, value):
        if Business.objects.filter(business_username=value).exists():
            raise serializers.ValidationError("This business username is already taken.")
        return value

    def validate_contact_email(self, value):
        if User.objects.filter(email=value).exists():
            # you may decide to allow re-use, but for now reject
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Create business
        business = Business.objects.create(
            business_username=validated_data["business_username"],
            business_name=validated_data["business_name"],
            business_type=validated_data["business_type"],
            contact_person=validated_data["contact_person"],
            contact_email=validated_data["contact_email"],
            contact_phone=validated_data.get("contact_phone", ""),
            country=validated_data.get("country", ""),
            is_active=True,
        )

        # Default branding
        BusinessBranding.objects.get_or_create(business=business)

        # Determine role for first admin user
        if business.business_type == Business.BusinessType.RESELLER:
            role = "RESELLER_ADMIN"
        else:
            role = "CLIENT_ADMIN"

        # Create admin user with UNUSABLE password, unverified email
        user = User.objects.create_user(
            email=validated_data["contact_email"],
            password=None,
            business=business,
            role=role,
        )
        user.is_email_verified = False
        user.invited_at = timezone.now()
        user.save(update_fields=["is_email_verified", "invited_at"])

        # Send invite email
        send_invite_email(user)

        # We don't auto-login, just return info
        return {
            "business": business,
            "user": user,
        }


class BusinessRegistrationResponseSerializer(serializers.Serializer):
    business_username = serializers.CharField()
    business_name = serializers.CharField()
    business_type = serializers.CharField()
    contact_email = serializers.EmailField()
    message = serializers.CharField()


# ============================================================
# RESELLER CREATION (ADMIN ONLY)
# ============================================================
class ResellerCreateSerializer(serializers.Serializer):
    business_username = serializers.SlugField(max_length=60)
    business_name = serializers.CharField(max_length=200)
    contact_person = serializers.CharField(max_length=200)
    contact_email = serializers.EmailField()
    contact_phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_business_username(self, value):
        if Business.objects.filter(business_username=value).exists():
            raise serializers.ValidationError("This business username is already taken.")
        return value

    def validate_contact_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        from django.utils import timezone

        business = Business.objects.create(
            business_username=validated_data["business_username"],
            business_name=validated_data["business_name"],
            business_type=Business.BusinessType.RESELLER,
            contact_person=validated_data["contact_person"],
            contact_email=validated_data["contact_email"],
            contact_phone=validated_data.get("contact_phone", ""),
            country=validated_data.get("country", ""),
            is_active=True,
        )

        BusinessBranding.objects.get_or_create(business=business)

        user = User.objects.create_user(
            email=validated_data["contact_email"],
            password=None,
            business=business,
            role="RESELLER_ADMIN",
        )
        user.is_email_verified = False
        user.invited_at = timezone.now()
        user.save(update_fields=["is_email_verified", "invited_at"])

        send_invite_email(user)

        return business


# ============================================================
# CLIENT CREATION (RESELLER ONLY)
# ============================================================
class ClientCreateSerializer(serializers.Serializer):
    parent_reseller = serializers.SlugField(write_only=True)
    business_username = serializers.SlugField(max_length=60)
    business_name = serializers.CharField(max_length=200)
    contact_person = serializers.CharField(max_length=200)
    contact_email = serializers.EmailField()
    contact_phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_business_username(self, value):
        if Business.objects.filter(business_username=value).exists():
            raise serializers.ValidationError("This business username is already taken.")
        return value

    def validate_contact_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_parent_reseller(self, value):
        if not Business.objects.filter(business_username=value, business_type=Business.BusinessType.RESELLER).exists():
            raise serializers.ValidationError("Parent reseller not found.")
        return value

    def create(self, validated_data):
        from django.utils import timezone

        reseller_username = validated_data.pop("parent_reseller")
        parent_reseller = Business.objects.get(business_username=reseller_username, business_type=Business.BusinessType.RESELLER)

        business = Business.objects.create(
            business_username=validated_data["business_username"],
            business_name=validated_data["business_name"],
            business_type=Business.BusinessType.CLIENT,
            parent=parent_reseller,
            contact_person=validated_data["contact_person"],
            contact_email=validated_data["contact_email"],
            contact_phone=validated_data.get("contact_phone", ""),
            country=validated_data.get("country", ""),
            is_active=True,
        )

        BusinessBranding.objects.get_or_create(business=business)

        user = User.objects.create_user(
            email=validated_data["contact_email"],
            password=None,
            business=business,
            role="CLIENT_ADMIN",
        )
        user.is_email_verified = False
        user.invited_at = timezone.now()
        user.save(update_fields=["is_email_verified", "invited_at"])

        send_invite_email(user)

        return business
class PublicBusinessRegistrationSerializer(serializers.Serializer):
    business_username = serializers.SlugField(max_length=90)
    business_name = serializers.CharField(max_length=200)
    business_type = serializers.ChoiceField(choices=Business.BusinessType.choices)
    contact_person = serializers.CharField(max_length=200)
    contact_email = serializers.EmailField()
    contact_phone = serializers.CharField(max_length=50)
    country = serializers.CharField(max_length=100)

    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_business_username(self, value):
        if Business.objects.filter(business_username=value).exists():
            raise serializers.ValidationError("Business username already exists.")
        return value

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")

        if password != password2:
            raise serializers.ValidationError({"password2": "Passwords do not match."})

        validate_password(password)
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password2")

        # Create business
        business = Business.objects.create(**validated_data)

        # Create admin user for the business
        user = User.objects.create_user(
            email=validated_data["contact_email"],
            password=password,
            business=business,
            role="CLIENT_ADMIN",
            username=validated_data["business_username"],  # default username
            is_email_verified=True,  # Public registration → verified immediately
        )

        return {
            "business": business,
            "user": user,
        }