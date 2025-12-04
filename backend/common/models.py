from django.db import models
from business.models import Business
import uuid


class TimeStampedModel(models.Model):
    """
    Base model providing created_at & updated_at timestamps.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BusinessScopedModel(TimeStampedModel):
    """
    Base model for all multi-tenant Business-scoped objects.
    Ensures every table links to a specific Business.
    """
    business = models.ForeignKey(Business, on_delete=models.CASCADE)

    class Meta:
        abstract = True
class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey("identity.User", null=True, blank=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.action}] {self.user}"