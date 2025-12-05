# # from django.contrib import admin
# # from .models import Business, BusinessDomain, BusinessBranding

# from django.contrib import admin
# from .models import Business, BusinessDomain, BusinessBranding

# class BusinessDomainInline(admin.TabularInline):
#     model = BusinessDomain
#     extra = 1

# class BusinessBrandingInline(admin.StackedInline):
#     model = BusinessBranding
#     extra = 0

# @admin.register(Business)
# class BusinessAdmin(admin.ModelAdmin):
#     list_display = ("business_name", "business_type", "contact_person", "is_active")
#     list_filter = ("business_type", "is_active")
#     search_fields = ("business_name", "contact_person", "contact_email")
#     inlines = [BusinessDomainInline, BusinessBrandingInline]


from django.contrib import admin
from .models import BusinessGroup, Business, BusinessDomain, BusinessBranding


@admin.register(BusinessGroup)
class BusinessGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
    filter_horizontal = ("permissions",)

    def has_module_permission(self, request):
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


# Registering the rest for completeness
class BusinessDomainInline(admin.TabularInline):
    model = BusinessDomain
    extra = 1


class BusinessBrandingInline(admin.StackedInline):
    model = BusinessBranding
    extra = 0


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    # list_display = ("business_name", "business_type", "contact_email", "is_active")
    list_display = ("business_name", "business_username", "business_type", "contact_email", "is_active")
    list_filter = ("business_type", "is_active")
    search_fields = ("business_name","business_username","contact_email")
    inlines = [BusinessDomainInline, BusinessBrandingInline]
    filter_horizontal = ("groups",)

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser



