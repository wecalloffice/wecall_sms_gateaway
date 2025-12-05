
from django.urls import include, path
from identity.views import SetupInviteView
from billing.views import AdminTopUpView, SelfTopUpView

from identity.views import (
    LoginView,
    RefreshView,
    MeView,
    GenerateApiKeyView,
    SetupPasswordView,
    ResendInviteView,
)
from business.views import (
    BusinessRegistrationView,
    BusinessCreateView,
    BusinessListView,
    PublicBusinessRegistrationView,
    ResellerCreateView,
    ResellerListView,
    ClientCreateView,
    ClientListView,
)
from business.views import (
    BusinessRegistrationView,
    BusinessCreateView,
    BusinessListView,
    ResellerCreateView,
    ResellerListView,
    ClientCreateView,
    ClientListView,
)

urlpatterns = [
    # Auth
    # path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),

    path("auth/refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/api-key/", GenerateApiKeyView.as_view(), name="auth-api-key"),
    path("auth/setup-password/", SetupPasswordView.as_view(), name="auth-setup-password"),
    path("auth/resend-invite/", ResendInviteView.as_view(), name="auth-resend-invite"),
    path("business/self-register/", PublicBusinessRegistrationView.as_view(), name="public-business-register"),


    # Business registration (public)
    path("business/register/", BusinessRegistrationView.as_view(), name="business-register"),

    # Business admin operations
    path("business/", BusinessCreateView.as_view(), name="business-create"),
    path("business/list/", BusinessListView.as_view(), name="business-list"),
    path("business/resellers/", ResellerCreateView.as_view(), name="reseller-create"),
    path("business/resellers/list/", ResellerListView.as_view(), name="reseller-list"),
    path("business/clients/", ClientCreateView.as_view(), name="client-create"),
    path("business/clients/list/", ClientListView.as_view(), name="client-list"),
    path("auth/setup/<uidb64>/<token>/", SetupInviteView.as_view(), name="auth-setup"),
    path("business/", BusinessCreateView.as_view(), name="business-create"),
    path("business/list/", BusinessListView.as_view(), name="business-list"),
    path("business/resellers/", ResellerCreateView.as_view(), name="reseller-create"),
    path("business/resellers/list/", ResellerListView.as_view(), name="reseller-list"),
    path("business/clients/", ClientCreateView.as_view(), name="client-create"),
    path("business/clients/list/", ClientListView.as_view(), name="client-list"),
    
    # path("billing/topup/admin/", AdminTopUpView.as_view(), name="admin-topup"),
    # path("billing/topup/reseller/", ResellerTopUpView.as_view(), name="reseller-topup"),

    # path("billing/topup/admin/", AdminTopUpView.as_view(), name="admin-topup"),
    # path("billing/topup/reseller/", ResellerTopUpView.as_view(), name="reseller-topup"),

    # # Billing group of endpoints (nested include)
    # path("billing/", include("billing.urls")),
    path("billing/topup/admin/", AdminTopUpView.as_view(), name="admin-topup"),
    path("billing/topup/self/", SelfTopUpView.as_view(), name="self-topup"),

    # Include full billing API
    path("billing/", include("billing.urls")),
    path("sms/", include("messaging.urls")),


]
