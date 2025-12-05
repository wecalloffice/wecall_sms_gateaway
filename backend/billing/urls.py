

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter

# from billing.views import (
#     WalletDetailView,
#     AdminTopUpView,
#     SelfTopUpView,
#     TransactionListView,
#     ChargeWalletView,
#     SmsPriceViewSet,
#     ResellerCommissionViewSet,
#     CommissionRevenueView,
#     RevenueSummaryView,
# )

# router = DefaultRouter()
# router.register(r"sms-prices", SmsPriceViewSet, basename="sms-price")
# router.register(r"commissions", ResellerCommissionViewSet, basename="commission")

# urlpatterns = [
#     # Wallet info + transactions
#     path("wallet/", WalletDetailView.as_view(), name="billing-wallet-detail"),
#     path("transactions/", TransactionListView.as_view(), name="billing-transactions"),

#     # Top-ups
#     path("topup/admin/", AdminTopUpView.as_view(), name="billing-admin-topup"),
#     path("topup/self/", SelfTopUpView.as_view(), name="billing-self-topup"),

#     # Charge for SMS (internal)
#     path("charge/", ChargeWalletView.as_view(), name="billing-charge"),

#     # Revenue endpoints
#     path("revenue/commissions/", CommissionRevenueView.as_view(), name="billing-revenue-commissions"),
#     path("revenue/summary/", RevenueSummaryView.as_view(), name="billing-revenue-summary"),

#     # ViewSets for prices & commissions
#     path("", include(router.urls)),
# ]

# billing/urls.py

from django.urls import path
from billing.views import (
    WalletDetailView,
    SelfTopUpView, AdminTopUpView,
    TransactionListView,
    ChargeWalletView,
)

urlpatterns = [
    path("wallet/", WalletDetailView.as_view()),
    path("topup/self/", SelfTopUpView.as_view()),
    path("topup/admin/", AdminTopUpView.as_view()),
    path("transactions/", TransactionListView.as_view()),
    path("charge/", ChargeWalletView.as_view()),
]
