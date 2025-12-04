

# import uuid
# from django.db import models


# class Business(models.Model):
#     class BusinessType(models.TextChoices):
#         RESELLER = 'RESELLER', 'Reseller'
#         CLIENT = 'CLIENT', 'Client'
#         PARTNER = 'PARTNER', 'Partner'
#         ORGANIZATION = 'ORGANIZATION', 'Organization'

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     business_username = models.SlugField(
#         max_length=90,
#         unique=True,
#         help_text="Short unique code for this business (e.g. 'kcb', 'rdb', 'mtnbiz')."
#     )

#     business_name = models.CharField(max_length=200)
#     business_type = models.CharField(max_length=20, choices=BusinessType.choices)

#     parent = models.ForeignKey(
#         'self',
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name='children',
#         help_text='Resellers can have multiple client businesses.'
#     )



#     contact_person = models.CharField(max_length=200, blank=True)
#     contact_email = models.EmailField(blank=True)
#     contact_phone = models.CharField(max_length=50, blank=True)

#     industry_category = models.CharField(max_length=100, blank=True)
#     address = models.TextField(blank=True)
#     website = models.URLField(blank=True)

#     country = models.CharField(max_length=100, blank=True)
#     is_active = models.BooleanField(default=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     groups = models.ManyToManyField(
#         'business.BusinessGroup',
#         blank=True,
#         related_name='businesses',
#         help_text='Permission groups assigned to this business'
#     )

#     def __str__(self):
#         return f"{self.business_name} ({self.business_type})"

#     class Meta:
#         ordering = ['business_name']
#         verbose_name_plural = 'businesses'

# class BusinessDomain(models.Model):
#     domain = models.CharField(max_length=255, unique=True)
#     business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='domains')
#     is_primary = models.BooleanField(default=False)

#     def save(self, *args, **kwargs):
#         # ensure only one primary domain per business
#         if self.is_primary:
#             BusinessDomain.objects.filter(business=self.business, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.domain} → {self.business.business_name}"

#     class Meta:
#         ordering = ['-is_primary', 'domain']


# class BusinessBranding(models.Model):
#     business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name='branding')

#     logo = models.URLField(blank=True)
#     favicon = models.URLField(blank=True)

#     primary_color = models.CharField(max_length=20, default='#0057ff')
#     secondary_color = models.CharField(max_length=20, default='#002266')

#     dashboard_title = models.CharField(max_length=200, default='WeCall SMS')

#     custom_css = models.TextField(blank=True)

#     def __str__(self):
#         return f"Branding for {self.business.business_name}"


# class BusinessGroup(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True)

#     permissions = models.ManyToManyField(
#         'auth.Permission',
#         blank=True,
#         help_text='Permissions granted to this group',
#     )

#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = 'Business Group'
#         verbose_name_plural = 'Business Groups'
#         ordering = ['name']

# import uuid
# from django.db import models


# # -----------------------------
# #  BUSINESS MODEL
# # -----------------------------
# class Business(models.Model):
#     class BusinessType(models.TextChoices):
#         RESELLER = "RESELLER", "Reseller"
#         CLIENT = "CLIENT", "Client"
#         PARTNER = "PARTNER", "Partner"
#         ORGANIZATION = "ORGANIZATION", "Organization"

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

#     # Unified login identifier for the business
#     business_username = models.SlugField(
#         max_length=60,
#         unique=True,
#         help_text="Unique business code: example 'kcb', 'mtnbiz', 'rdb'.",
#     )

#     business_name = models.CharField(max_length=200)
#     business_type = models.CharField(max_length=20, choices=BusinessType.choices)

#     # Parent → used for resellers with multiple clients
#     parent = models.ForeignKey(
#         "self",
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name="children",
#         help_text="Resellers can own multiple client businesses.",
#     )

#     # Contact details
#     contact_person = models.CharField(max_length=200, blank=True)
#     contact_email = models.EmailField(blank=True)
#     contact_phone = models.CharField(max_length=50, blank=True)

#     industry_category = models.CharField(max_length=100, blank=True)
#     address = models.TextField(blank=True)
#     website = models.URLField(blank=True)

#     country = models.CharField(max_length=100, blank=True)
#     is_active = models.BooleanField(default=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     # Permission group system
#     groups = models.ManyToManyField(
#         "business.BusinessGroup",
#         blank=True,
#         related_name="businesses",
#         help_text="Permission groups attached to this business",
#     )

#     def __str__(self):
#         return f"{self.business_name} ({self.business_username})"

#     class Meta:
#         ordering = ["business_name"]
#         verbose_name = "Business"
#         verbose_name_plural = "Businesses"


# # -----------------------------
# #  BUSINESS DOMAINS
# # -----------------------------
# class BusinessDomain(models.Model):
#     domain = models.CharField(max_length=255, unique=True)
#     business = models.ForeignKey(
#         Business, on_delete=models.CASCADE, related_name="domains"
#     )
#     is_primary = models.BooleanField(default=False)

#     def save(self, *args, **kwargs):
#         if self.is_primary:
#             BusinessDomain.objects.filter(
#                 business=self.business, is_primary=True
#             ).exclude(pk=self.pk).update(is_primary=False)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.domain} → {self.business.business_name}"

#     class Meta:
#         ordering = ["-is_primary", "domain"]


# # -----------------------------
# #  BRANDING — LOGO, COLORS, CSS
# # -----------------------------
# class BusinessBranding(models.Model):
#     business = models.OneToOneField(
#         Business, on_delete=models.CASCADE, related_name="branding"
#     )

#     logo = models.URLField(blank=True)
#     favicon = models.URLField(blank=True)

#     primary_color = models.CharField(max_length=20, default="#0057ff")
#     secondary_color = models.CharField(max_length=20, default="#002266")

#     dashboard_title = models.CharField(max_length=200, default="WeCall SMS")
#     custom_css = models.TextField(blank=True)

#     def __str__(self):
#         return f"Branding for {self.business.business_name}"


# # -----------------------------
# #  BUSINESS PERMISSION GROUPS
# # -----------------------------
# class BusinessGroup(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True)

#     permissions = models.ManyToManyField(
#         "auth.Permission",
#         blank=True,
#         help_text="Permissions granted to this business group",
#     )

#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = "Business Group"
#         verbose_name_plural = "Business Groups"
#         ordering = ["name"]


# import uuid
# from django.db import models


# class Business(models.Model):
#     class BusinessType(models.TextChoices):
#         RESELLER = "RESELLER", "Reseller"
#         CLIENT = "CLIENT", "Client"
#         PARTNER = "PARTNER", "Partner"
#         ORGANIZATION = "ORGANIZATION", "Organization"

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

#     business_username = models.SlugField(
#         max_length=60,
#         unique=True,
#         help_text="Unique business code: example 'kcb', 'mtnbiz', 'rdb'.",
#     )

#     business_name = models.CharField(max_length=200)
#     business_type = models.CharField(max_length=20, choices=BusinessType.choices)

#     parent = models.ForeignKey(
#         "self",
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name="children",
#         help_text="Resellers can own multiple client businesses.",
#     )

#     contact_person = models.CharField(max_length=200, blank=True)
#     contact_email = models.EmailField(blank=True)
#     contact_phone = models.CharField(max_length=50, blank=True)

#     industry_category = models.CharField(max_length=100, blank=True)
#     address = models.TextField(blank=True)
#     website = models.URLField(blank=True)

#     country = models.CharField(max_length=100, blank=True)
#     is_active = models.BooleanField(default=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     groups = models.ManyToManyField(
#         "business.BusinessGroup",
#         blank=True,
#         related_name="businesses",
#         help_text="Permission groups attached to this business",
#     )

#     def __str__(self):
#         return f"{self.business_name} ({self.business_username})"

#     class Meta:
#         ordering = ["business_name"]
#         verbose_name = "Business"
#         verbose_name_plural = "Businesses"


# class BusinessDomain(models.Model):
#     domain = models.CharField(max_length=255, unique=True)
#     business = models.ForeignKey(
#         Business, on_delete=models.CASCADE, related_name="domains"
#     )
#     is_primary = models.BooleanField(default=False)

#     def save(self, *args, **kwargs):
#         if self.is_primary:
#             BusinessDomain.objects.filter(
#                 business=self.business, is_primary=True
#             ).exclude(pk=self.pk).update(is_primary=False)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.domain} → {self.business.business_name}"

#     class Meta:
#         ordering = ["-is_primary", "domain"]


# class BusinessBranding(models.Model):
#     business = models.OneToOneField(
#         Business, on_delete=models.CASCADE, related_name="branding"
#     )

#     logo = models.URLField(blank=True)
#     favicon = models.URLField(blank=True)

#     primary_color = models.CharField(max_length=20, default="#0057ff")
#     secondary_color = models.CharField(max_length=20, default="#002266")

#     dashboard_title = models.CharField(max_length=200, default="WeCall SMS")
#     custom_css = models.TextField(blank=True)

#     def __str__(self):
#         return f"Branding for {self.business.business_name}"


# class BusinessGroup(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True)

#     permissions = models.ManyToManyField(
#         "auth.Permission",
#         blank=True,
#         help_text="Permissions granted to this business group",
#     )

#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = "Business Group"
#         verbose_name_plural = "Business Groups"
#         ordering = ["name"]



# business/models.py
import uuid
from django.db import models


class Business(models.Model):
    class BusinessType(models.TextChoices):
        RESELLER = "RESELLER", "Reseller"
        CLIENT = "CLIENT", "Client"
        PARTNER = "PARTNER", "Partner"
        ORGANIZATION = "ORGANIZATION", "Organization"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    business_username = models.SlugField(
        max_length=60,
        unique=True,
        default="Null",
        help_text="Unique business code: e.g. 'kcb', 'rdb', 'mtnbiz'.",
    )

    business_name = models.CharField(max_length=200)
    business_type = models.CharField(max_length=20, choices=BusinessType.choices)

    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
        help_text="Resellers can own multiple client businesses.",
    )

    contact_person = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(blank=True)  # 🔑 used for first login
    contact_phone = models.CharField(max_length=50, blank=True)

    industry_category = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    website = models.URLField(blank=True)

    country = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        "business.BusinessGroup",
        blank=True,
        related_name="businesses",
        help_text="Permission groups attached to this business",
    )

    def __str__(self):
        return f"{self.business_name} ({self.business_username})"

    class Meta:
        ordering = ["business_name"]
        verbose_name = "Business"
        verbose_name_plural = "Businesses"


class BusinessDomain(models.Model):
    domain = models.CharField(max_length=255, unique=True)
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name="domains"
    )
    is_primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_primary:
            BusinessDomain.objects.filter(
                business=self.business, is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.domain} → {self.business.business_name}"

    class Meta:
        ordering = ["-is_primary", "domain"]


class BusinessBranding(models.Model):
    business = models.OneToOneField(
        Business, on_delete=models.CASCADE, related_name="branding"
    )

    logo = models.URLField(blank=True)
    favicon = models.URLField(blank=True)

    primary_color = models.CharField(max_length=20, default="#0057ff")
    secondary_color = models.CharField(max_length=20, default="#002266")

    dashboard_title = models.CharField(max_length=200, default="WeCall SMS")
    custom_css = models.TextField(blank=True)

    def __str__(self):
        return f"Branding for {self.business.business_name}"


class BusinessGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    permissions = models.ManyToManyField(
        "auth.Permission",
        blank=True,
        help_text="Permissions granted to this business group",
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Business Group"
        verbose_name_plural = "Business Groups"
        ordering = ["name"]
