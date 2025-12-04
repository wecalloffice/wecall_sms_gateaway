# from django.utils.deprecation import MiddlewareMixin
# from .models import BusinessDomain

# class BusinessMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         host = request.get_host().split(':')[0]
#         try:
#             business_domain = BusinessDomain.objects.select_related("business").get(domain=host)
#             request.business = business_domain.business
#         except BusinessDomain.DoesNotExist:
#             request.business = None  # fallback or use platform business
# business/middleware.py

import logging
from django.utils.deprecation import MiddlewareMixin
from business.models import BusinessDomain

logger = logging.getLogger(__name__)


# class BusinessMiddleware(MiddlewareMixin):
#     """
#     Multi-tenant business resolver middleware.
#     Detects tenant/business based on the request host.

#     Examples:
#         kcb.wecallsms.rw  → Business 'KCB'
#         rdb.wecallsms.rw  → Business 'RDB'
#         localhost:8000    → Platform / fallback
#     """

#     def process_request(self, request):
#         host = request.get_host().split(":")[0].lower().strip()

#         # Normalize domain
#         if host.startswith("www."):
#             host = host[4:]

#         # Local dev support
#         if host in ("127.0.0.1", "localhost"):
#             request.business = None
#             request.is_local_dev = True
#             logger.debug("Localhost detected → No business resolution")
#             return

#         # Detect business by domain
#         try:
#             business_domain = BusinessDomain.objects.select_related("business").get(domain=host)
#             request.business = business_domain.business
#             request.is_local_dev = False

#             logger.debug(
#                 f"Resolved domain '{host}' to business '{business_domain.business.business_name}' "
#                 f"({business_domain.business.business_username})"
#             )

#         except BusinessDomain.DoesNotExist:
#             # Unknown domain → treat as public / error / fallback
#             request.business = None
#             request.is_local_dev = False

#             logger.warning(f"Unknown domain: '{host}' → No business resolved")

#             # OPTIONAL:
#             # You can enforce domain must match business:
#             # return HttpResponseForbidden("Invalid domain")

#             return

class BusinessMiddleware(MiddlewareMixin):
    def process_request(self, request):
        host = request.get_host().split(':')[0]

        # Dev mode: allow 127.0.0.1 / localhost with no business
        if host in ("127.0.0.1", "localhost"):
            request.business = None
            return

        try:
            business_domain = BusinessDomain.objects.select_related("business").get(domain=host)
            request.business = business_domain.business
        except BusinessDomain.DoesNotExist:
            request.business = None

