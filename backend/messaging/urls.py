# messaging/urls.py

from django.urls import path
from messaging.views import SendSmsView, SmsDlrCallbackView, SmsInboundCallbackView

urlpatterns = [
    path("send/", SendSmsView.as_view(), name="sms-send"),
    path("dlr/", SmsDlrCallbackView.as_view(), name="sms-dlr"),
    path("inbound/", SmsInboundCallbackView.as_view(), name="sms-inbound"),
]
