from .base import *
import os


DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "pnteziryayo422@gmail.com"
EMAIL_HOST_PASSWORD = "fnll ppua whzx hfxf"
EMAIL_USE_TLS = True
# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DEFAULT_FROM_EMAIL = "WeCallSMS <pnteziryayo422@gmail.com>"