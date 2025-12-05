# from django.urls import path
# from .views import SetupInviteView

# urlpatterns = [
#     path("setup/<str:invite_token>/<str:signature>/", 
#          SetupInviteView.as_view(), 
#          name="auth-setup-invite"),
# ]

from django.urls import path
from .views import SetupInviteView
from identity.views import LoginView


urlpatterns = [
    path("setup/<str:uidb64>/<str:token>/", SetupInviteView.as_view(), name="auth-setup-invite"),
    path("login/", LoginView.as_view(), name="business-login"),
]
