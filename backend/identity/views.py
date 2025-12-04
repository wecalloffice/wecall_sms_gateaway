
# identity/views.py
from rest_framework import generics, permissions
from rest_framework.views import APIView
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status
from django.shortcuts import render
from django.views import View

from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from identity.serializers import SetupPasswordSerializer
from identity.models import User
from .serializers import BusinessLoginSerializer, UserSerializer, ApiKeyGenerateSerializer, SetupPasswordSerializer, ResendInviteSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = BusinessLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}  # IMPORTANT
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

# class LoginView(generics.GenericAPIView):
#     """
#     POST /api/v1/auth/login/
#     Body:
#     {
#       "username": "james",
#       "password": "StrongPassword123!"
#     }
#     Business is determined by domain (middleware).
#     """
#     serializer_class = BusinessLoginSerializer
#     permission_classes = [permissions.AllowAny]
#     throttle_scope = "auth_login"

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(
#             data=request.data,
#             context={"request": request}   # 👈 important
#         )
#         serializer.is_valid(raise_exception=True)
#         return Response(serializer.validated_data, status=200)


class RefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth_refresh"


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class GenerateApiKeyView(generics.CreateAPIView):
    serializer_class = ApiKeyGenerateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={})
        serializer.is_valid(raise_exception=False)
        result = serializer.save()
        return Response(result)


class SetupPasswordView(generics.GenericAPIView):
    """
    POST /api/v1/auth/setup-password/
    {
      "uidb64": "...",
      "token": "...",
      "username": "james",
      "password": "StrongPassword123!",
      "password2": "StrongPassword123!"
    }
    """
    serializer_class = SetupPasswordSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth_setup"

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=200)


class ResendInviteView(generics.GenericAPIView):
    """
    POST /api/v1/auth/resend-invite/
    {
      "business_username": "kcb",
      "email": "contact@kcb.rw"
    }
    """
    serializer_class = ResendInviteSerializer
    permission_classes = [permissions.IsAuthenticated]  # platform admin or reseller
    throttle_scope = "auth_resend_invite"

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=200)

class SetupInviteView(APIView):
    """
    GET /auth/setup/<uidb64>/<token>/
    This validates the invite link and returns the user info.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid or expired setup link."},
                            status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Token has expired or is invalid."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Success — return info so frontend can show create-password page
        return Response({
            "valid": True,
            "message": "Invite link is valid.",
            "uidb64": uidb64,
            "token": token,
            "email": user.email,
            "username": user.username,
            "business": user.business.business_name if hasattr(user, "business") else None,
        })
        
class LoginView(generics.GenericAPIView):
    serializer_class = BusinessLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
class SetupPasswordView(generics.GenericAPIView):
    serializer_class = SetupPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=200)

class SetupPasswordPageView(View):
    """
    HTML page for entering username + password.
    GET  → show form
    POST → validate & set password via serializer
    """
    template_name = "identity/setup_password.html"

    def get(self, request, uidb64, token):
        # Decode user ID
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return render(request, self.template_name, {
                "valid": False,
                "error": "Invalid or expired setup link."
            })

        # Validate token
        if not default_token_generator.check_token(user, token):
            return render(request, self.template_name, {
                "valid": False,
                "error": "Invalid or expired token."
            })

        return render(request, self.template_name, {
            "valid": True,
            "uidb64": uidb64,
            "token": token,
            "email": user.email,
            "business": getattr(user.business, "business_name", None),
            "username": user.username or "",
            "errors": {},
        })

    def post(self, request, uidb64, token):
        data = {
            "uidb64": uidb64,
            "token": token,
            "username": request.POST.get("username", ""),
            "password": request.POST.get("password", ""),
            "password2": request.POST.get("password2", ""),
        }

        serializer = SetupPasswordSerializer(
            data=data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return render(request, self.template_name, {
                "valid": True,
                "uidb64": uidb64,
                "token": token,
                "email": "",
                "business": "",
                "username": data["username"],
                "errors": serializer.errors,
            })

        serializer.save()

        return render(request, "identity/setup_password_success.html", {
            "message": "Your password has been set. You can now log in."
        })