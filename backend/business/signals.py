from django.db.models.signals import post_save
from django.dispatch import receiver

from business.models import Business
from billing.models import Wallet


@receiver(post_save, sender=Business)
def create_business_wallet(sender, instance: Business, created: bool, **kwargs):
    """
    Automatically create a wallet for every new Business.
    """
    if created:
        Wallet.objects.get_or_create(business=instance)
