
# # identity/models.py
# import uuid
# import secrets
# import hashlib
# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# from business.models import Business


# class UserManager(BaseUserManager):
#     def create_user(self, email, password=None, business=None, **extra_fields):
#         if not email:
#             raise ValueError("Users must have an email")
#         if business is None:
#             raise ValueError("User must belong to a Business")

#         email = self.normalize_email(email)
#         user = self.model(email=email, business=business, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password, **extra_fields):
#         platform_business, _ = Business.objects.get_or_create(
#             business_username="wecall",
#             defaults={
#                 "business_name": "WeCall Platform",
#                 "business_type": Business.BusinessType.ORGANIZATION,
#             },
#         )

#         extra_fields.setdefault("role", "PLATFORM_ADMIN")
#         extra_fields.setdefault("is_staff", True)
#         extra_fields.setdefault("is_superuser", True)

#         return self.create_user(email, password, business=platform_business, **extra_fields)


# class User(AbstractBaseUser, PermissionsMixin):
#     ROLE_CHOICES = (
#         ("PLATFORM_ADMIN", "Platform Admin"),
#         ("RESELLER_ADMIN", "Reseller Admin"),
#         ("CLIENT_ADMIN", "Client Admin"),
#         ("CLIENT_USER", "Client User"),
#     )

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     business = models.ForeignKey(Business, on_delete=models.CASCADE)

#     email = models.EmailField(unique=True)  # 🔑 unique globally; OK for now
#     role = models.CharField(max_length=30, choices=ROLE_CHOICES)

#     api_key_hash = models.CharField(max_length=255, null=True, blank=True)

#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     # (Optional) Business permission groups
#     business_groups = models.ManyToManyField(
#         "business.BusinessGroup",
#         blank=True,
#         related_name="users",
#         help_text="Business role groups for this user",
#     )

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = []  # no extra required fields when creating superuser

#     objects = UserManager()

#     def __str__(self):
#         return self.email

#     # --- API KEY SUPPORT ---
#     def generate_api_key(self) -> str:
#         raw_key = secrets.token_urlsafe(32)
#         self.api_key_hash = self._hash_key(raw_key)
#         self.save(update_fields=["api_key_hash"])
#         return raw_key

#     @staticmethod
#     def _hash_key(raw_key: str) -> str:
#         return hashlib.sha256(raw_key.encode()).hexdigest()

#     def check_api_key(self, raw_key: str) -> bool:
#         if not self.api_key_hash:
#             return False
#         return self.api_key_hash == self._hash_key(raw_key)

# identity/models.py
import uuid
import secrets
import hashlib
from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from business.models import Business


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, business=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email")
        if business is None:
            raise ValueError("User must belong to a Business")

        email = self.normalize_email(email)
        user = self.model(email=email, business=business, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        platform_business, _ = Business.objects.get_or_create(
            business_username="wecall",
            defaults={
                "business_name": "WeCall Platform",
                "business_type": Business.BusinessType.ORGANIZATION,
            },
        )

        extra_fields.setdefault("role", "PLATFORM_ADMIN")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_email_verified", True)

        return self.create_user(email, password, business=platform_business, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("PLATFORM_ADMIN", "Platform Admin"),
        ("RESELLER_ADMIN", "Reseller Admin"),
        ("CLIENT_ADMIN", "Client Admin"),
        ("CLIENT_USER", "Client User"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)

    # ✅ Login identifier per business (user chooses this at first setup)
    username = models.CharField(max_length=50, blank=True, null=True)

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)

    api_key_hash = models.CharField(max_length=255, null=True, blank=True)

    # ✅ Security & verification
    is_email_verified = models.BooleanField(default=False)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    invited_at = models.DateTimeField(null=True, blank=True)

    # Optional: business groups
    business_groups = models.ManyToManyField(
        "business.BusinessGroup",
        blank=True,
        related_name="users",
        help_text="Business role groups for this user",
    )

    USERNAME_FIELD = "email"   # backend identity; API login uses business+username
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    # --- API KEY SUPPORT ---
    def generate_api_key(self) -> str:
        raw_key = secrets.token_urlsafe(32)
        self.api_key_hash = self._hash_key(raw_key)
        self.save(update_fields=["api_key_hash"])
        return raw_key

    @staticmethod
    def _hash_key(raw_key: str) -> str:
        return hashlib.sha256(raw_key.encode()).hexdigest()

    def check_api_key(self, raw_key: str) -> bool:
        if not self.api_key_hash:
            return False
        return self.api_key_hash == self._hash_key(raw_key)

    # --- Lockout helpers ---
    MAX_FAILED_ATTEMPTS = 5
    LOCK_MINUTES = 15

    def register_failed_login(self):
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= self.MAX_FAILED_ATTEMPTS:
            self.locked_until = timezone.now() + timedelta(minutes=self.LOCK_MINUTES)
            self.failed_login_attempts = 0  # reset counter after lock
        self.save(update_fields=["failed_login_attempts", "locked_until"])

    def clear_login_failures(self):
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save(update_fields=["failed_login_attempts", "locked_until"])
class UserSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        "identity.User",
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    device = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    refresh_jti = models.CharField(max_length=255, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Session {self.id} for {self.user.email}"