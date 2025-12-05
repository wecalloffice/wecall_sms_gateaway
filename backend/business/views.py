
# business/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from business.serializers import PublicBusinessRegistrationSerializer

from business.models import Business
from business.serializers import (
    BusinessSerializer,
    ResellerCreateSerializer,
    ClientCreateSerializer,
    BusinessRegistrationSerializer,
    BusinessRegistrationResponseSerializer,
)


class BusinessRegistrationView(generics.CreateAPIView):
    """
    Public or semi-public endpoint to register a new business
    and create its first admin user.
    """
    serializer_class = BusinessRegistrationSerializer
    permission_classes = [permissions.AllowAny]  # later: add captcha, rate-limit

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

       
        
        response_data = {
            "business_username": result["business"].business_username,
            "business_name": result["business"].business_name,
            "business_type": result["business"].business_type,
            "contact_email": result["user"].email,
            "message": "Business created. Check email to complete password setup.",
        }

        output = BusinessRegistrationResponseSerializer(response_data)
        return Response(output.data, status=201)


# ============================================================
# 🔹 GENERIC BUSINESS CRUD
# ============================================================
class BusinessCreateView(generics.CreateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAdminUser]


class BusinessListView(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAdminUser]


# ============================================================
# 🔹 ADMIN CREATES A RESELLER
# ============================================================
class ResellerCreateView(generics.CreateAPIView):
    serializer_class = ResellerCreateSerializer
    permission_classes = [permissions.IsAdminUser]


class ResellerListView(generics.ListAPIView):
    queryset = Business.objects.filter(business_type="RESELLER")
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAdminUser]


# ============================================================
# 🔹 RESELLER CREATES A CLIENT (CHILD BUSINESS)
# ============================================================
class ClientCreateView(generics.CreateAPIView):
    serializer_class = ClientCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class ClientListView(generics.ListAPIView):
    queryset = Business.objects.filter(business_type="CLIENT")
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAuthenticated]

class PublicBusinessRegistrationView(generics.CreateAPIView):
    """
    Public: Business self-registers with password immediately.
    """
    serializer_class = PublicBusinessRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = serializer.save()

        return Response({
            "message": "Business registered successfully.",
            "business_username": result["business"].business_username,
            "business_name": result["business"].business_name,
            "contact_email": result["user"].email,
            "role": result["user"].role,
        }, status=201)