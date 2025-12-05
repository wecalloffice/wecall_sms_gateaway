# Data Storage & API Endpoints Map

**Status**: December 4, 2025 | **Current Phase**: Frontend (Mock) → Backend (PostgreSQL)

---

## 📊 Current Data Storage

### FRONTEND (Client-Side) - Mock Data Storage

#### Location: Browser `localStorage`

All frontend mock data is stored in the browser's localStorage with these keys:

| Data Type | localStorage Key | Storage Type | Persistence |
|-----------|------------------|--------------|------------|
| **Authentication** | `mockToken` | String (JWT-like) | Session only |
| **User Accounts** | `mockAccounts` | JSON Array | Session only |
| **SMS Messages** | `mockSMS` | JSON Array | Session only |
| **SMS Statistics** | `mockSMSStats` | JSON Object | Session only |
| **Billing Data** | `mockBilling` | JSON Object | Session only (when created) |
| **Wallets** | `mockWallets` | JSON Array | Session only (when created) |

#### Data Structure Examples:

**mockAccounts** (User Registration):
```json
[
  {
    "id": 1,
    "business_username": "acme",
    "business_name": "ACME Corporation",
    "business_type": "RESELLER",
    "contact_email": "admin@acme.com",
    "contact_phone": "2125551234",
    "country": "US",
    "account_sid": "AC_ACME",
    "parent_reseller": null,
    "created_at": "2025-12-04T10:00:00Z",
    "reseller_details": {
      "account_type": "PROFESSIONAL",
      "company_size": "201-500 employees",
      "industry": "Marketing Agency",
      "tax_id": "VAT123456789",
      "company_registration": "CR123456",
      "sub_clients": ["client1", "client2"],
      "created_date": "2025-12-04T10:00:00Z"
    }
  }
]
```

**mockSMS** (SMS Messages):
```json
[
  {
    "id": "SMS_001",
    "sender": "ACME",
    "recipient": "254712123456",
    "message": "Hello from ACME",
    "status": "delivered",
    "created_at": "2025-12-04T10:30:00Z",
    "dlr_received_at": "2025-12-04T10:30:05Z",
    "cost": 1.5,
    "account_sid": "AC_ACME"
  }
]
```

#### Current Mock Adapters:
- `mocks/adapters/mockAuth.ts` - Authentication & account management
- `mocks/adapters/mockSMS.ts` - SMS sending & delivery tracking
- `mocks/adapters/mockBilling.ts` - Billing operations (future)

#### Current Mock Data Files:
- `mocks/data/wecallMockData.ts` - Demo account fallback data

---

## 🗄️ BACKEND (Server-Side) - PostgreSQL Database

### Database Connection Details

**Location**: `backend/wecallsms_config/settings/base.py` (Lines 239-250)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'WeCall',
        'USER': 'neondb_owner',
        'PASSWORD': '***secured***',
        'HOST': 'ep-damp-voice-a802pr91-pooler.eastus2.azure.neon.tech',
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}
```

### Database Provider
- **Provider**: Neon (PostgreSQL Cloud)
- **Cloud**: Azure (eastus2 region)
- **SSL**: Required for all connections

### Database Tables (Django Models)

| App Module | Model | Table Name | Purpose |
|-----------|-------|-----------|---------|
| **identity** | User | identity_user | User accounts & authentication |
| **business** | Business | business_business | Business/account information |
| **business** | Reseller | business_reseller | Reseller-specific details |
| **business** | Client | business_client | Client-specific details |
| **messaging** | SMS | messaging_sms | SMS message records |
| **messaging** | DLR | messaging_dlr | Delivery receipts |
| **billing** | Invoice | billing_invoice | Invoices & billing records |
| **billing** | Transaction | billing_transaction | Payment transactions |
| **billing** | Wallet | billing_wallet | Wallet/balance data |
| **routing** | Route | routing_route | SMS routing rules |
| **integrations** | SMTPGateway | integrations_smtpgateway | Email gateway config |

---

## 🔌 API Endpoints Structure

### Backend API Location
**Path**: `backend/api/urls.py`

### Current Endpoints (Already Implemented)

#### Authentication Endpoints
```
POST   /api/auth/login/              → LoginView (identity.views)
POST   /api/auth/refresh/            → RefreshView (identity.views)
GET    /api/auth/me/                 → MeView (identity.views)
POST   /api/auth/generate-api-key/   → GenerateApiKeyView (identity.views)
POST   /api/auth/setup-password/     → SetupPasswordView (identity.views)
POST   /api/auth/resend-invite/      → ResendInviteView (identity.views)
POST   /api/auth/setup-invite/       → SetupInviteView (identity.views)
```

#### Business Registration Endpoints
```
POST   /api/business/register/              → BusinessRegistrationView
POST   /api/business/create/                → BusinessCreateView
GET    /api/business/list/                  → BusinessListView
POST   /api/business/public-register/       → PublicBusinessRegistrationView
POST   /api/business/reseller/create/       → ResellerCreateView
GET    /api/business/reseller/list/         → ResellerListView
POST   /api/business/client/create/         → ClientCreateView
GET    /api/business/client/list/           → ClientListView
```

---

## 📋 Endpoints to be Created (Next Phases)

### Phase 1: Wallet & Billing Module (NEXT)
**Location**: `backend/billing/views.py` & `backend/api/urls.py`

```
GET    /api/wallet/balance/              → Get wallet balance
POST   /api/wallet/topup/                → Top up wallet
GET    /api/wallet/transactions/         → Get transaction history
GET    /api/billing/invoices/            → Get invoices
GET    /api/billing/reports/             → Get billing reports
POST   /api/billing/payment/             → Process payment
```

**Django App**: `billing`
**Views File**: `backend/billing/views.py`
**Models**: 
- `Wallet` - Stores balance per account
- `Transaction` - Records all transactions
- `Invoice` - Billing documents
- `BillingPlan` - Subscription tiers

---

### Phase 2: SMS & Messaging Module
**Location**: `backend/messaging/views.py` & `backend/api/urls.py`

```
POST   /api/sms/send/                  → Send single SMS
POST   /api/sms/bulk/                  → Send bulk SMS
GET    /api/sms/list/                  → List SMS messages
GET    /api/sms/{id}/                  → Get SMS details
GET    /api/sms/dlr/{id}/              → Get delivery receipt
GET    /api/sms/stats/                 → SMS statistics
POST   /api/sms/schedule/              → Schedule SMS
GET    /api/sms/templates/             → Get SMS templates
```

**Django App**: `messaging`
**Models**:
- `SMS` - SMS records
- `DLR` - Delivery receipts
- `Template` - SMS templates

---

### Phase 3: Logs & Reports Module
**Location**: `backend/messaging/views.py` & `backend/api/urls.py`

```
GET    /api/logs/sms/                  → SMS delivery logs
GET    /api/logs/sms/filter/           → Filter SMS logs
GET    /api/reports/dlr/               → DLR analytics
GET    /api/reports/usage/             → Usage reports
GET    /api/reports/revenue/           → Revenue reports
POST   /api/reports/export/            → Export reports (CSV/PDF)
```

**Django App**: `messaging` & `observability`
**Models**:
- `Log` - General logging
- `Report` - Pre-generated reports

---

### Phase 4: Contacts & Groups
**Location**: New module `backend/contacts/views.py`

```
POST   /api/contacts/create/           → Create contact
GET    /api/contacts/list/             → List contacts
PUT    /api/contacts/{id}/             → Update contact
DELETE /api/contacts/{id}/             → Delete contact
POST   /api/groups/create/             → Create group
GET    /api/groups/list/               → List groups
POST   /api/groups/add-contacts/       → Add contacts to group
POST   /api/contacts/import/           → Bulk import CSV
GET    /api/contacts/export/           → Export CSV
```

**New Django App**: `contacts`
**Models**:
- `Contact` - Individual contacts
- `ContactGroup` - Contact groups
- `ContactImport` - Import history

---

### Phase 5: Settings & Security
**Location**: `backend/identity/views.py` & `backend/api/urls.py`

```
GET    /api/settings/profile/          → Get profile
PUT    /api/settings/profile/update/   → Update profile
POST   /api/settings/password/change/  → Change password
POST   /api/settings/2fa/enable/       → Enable 2FA
GET    /api/settings/api-keys/         → List API keys
POST   /api/settings/api-keys/create/  → Create API key
DELETE /api/settings/api-keys/{id}/    → Delete API key
POST   /api/settings/webhooks/         → Create webhook
GET    /api/settings/webhooks/         → List webhooks
PUT    /api/settings/webhooks/{id}/    → Update webhook
```

**Django App**: `identity`
**Models**:
- `APIKey` - API keys for developers
- `Webhook` - Webhook configurations
- `TwoFactorAuth` - 2FA setup

---

### Phase 6: Routing & SMPP Configuration
**Location**: `backend/routing/views.py` & `backend/api/urls.py`

```
POST   /api/routing/gateway/create/    → Create SMS gateway
GET    /api/routing/gateway/list/      → List gateways
PUT    /api/routing/gateway/{id}/      → Update gateway
DELETE /api/routing/gateway/{id}/      → Delete gateway
POST   /api/routing/rules/create/      → Create routing rule
GET    /api/routing/rules/list/        → List routing rules
POST   /api/routing/failover/          → Set failover
GET    /api/routing/test/              → Test gateway connection
```

**Django App**: `routing`
**Models**:
- `SMTPGateway` - SMS gateway configuration
- `RoutingRule` - Routing rules
- `GatewayTest` - Test results

---

### Phase 7: Sender IDs Management
**Location**: `backend/api/views.py` & `backend/api/urls.py`

```
POST   /api/senderid/register/         → Register sender ID
GET    /api/senderid/list/             → List sender IDs
GET    /api/senderid/{id}/status/      → Get approval status
DELETE /api/senderid/{id}/             → Delete sender ID
POST   /api/senderid/bulk/register/    → Bulk register
GET    /api/senderid/countries/        → Supported countries
```

**Django App**: `api`
**Models**:
- `SenderID` - Registered sender IDs
- `SenderIDRequest` - Approval requests

---

## 🔄 Frontend-to-Backend Integration Flow

### Current State (Mock Only)
```
Frontend (Next.js)
    ↓
Mock Adapters (localStorage)
    ↓
Mock Data (Session)
    ❌ No backend
```

### After Backend Integration
```
Frontend (Next.js)
    ↓
API Client (api.ts or similar)
    ↓
Backend API (Django REST)
    ↓
PostgreSQL Database
    ↓
Response → Frontend
```

---

## 📁 File Locations & Next Steps

### Frontend Files to Update
When backend is ready, update these files to use real API endpoints:

| File | Current Status | Change Required |
|------|---------------|-----------------| 
| `lib/api.ts` | Create if missing | Add real API endpoints |
| `mocks/adapters/mockAuth.ts` | Mock only | Keep for fallback |
| `mocks/adapters/mockSMS.ts` | Mock only | Add real endpoints |
| `mocks/adapters/mockBilling.ts` | Mock only (future) | Add real endpoints |
| `.env.local` | Create if missing | Add API base URL |

### Backend Files to Create
These are the core files for each new module:

```
backend/
├── [MODULE]/
│   ├── views.py          ← API endpoints
│   ├── models.py         ← Database models
│   ├── serializers.py    ← Data serialization
│   ├── urls.py           ← URL routing
│   ├── admin.py          ← Django admin config
│   └── migrations/       ← Database migrations
```

---

## 🚀 Deployment Architecture

### Frontend Deployment
- **Platform**: Vercel (Next.js optimized)
- **Environment**: `NEXT_PUBLIC_API_URL` (for API endpoint)
- **Build**: `npm run build`

### Backend Deployment
- **Platform**: Cloud (AWS/Azure/GCP recommended)
- **Database**: Neon PostgreSQL (already configured)
- **Server**: Django (Gunicorn/uWSGI recommended)
- **Web Server**: Nginx/Apache

---

## ✅ Migration Checklist

When backend is ready:

- [ ] Create backend app modules for each feature
- [ ] Define Django models for all data types
- [ ] Create serializers for API responses
- [ ] Implement views with proper authentication
- [ ] Add URL routing to `api/urls.py`
- [ ] Set up database migrations
- [ ] Create superuser for Django admin
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Update frontend `api.ts` with real endpoints
- [ ] Add environment variables for API URL
- [ ] Remove `mockAuth` fallbacks (or keep for offline mode)
- [ ] Add error handling for API failures
- [ ] Implement request/response logging
- [ ] Set up CI/CD pipeline

---

## 📞 API Authentication

### Current (Mock)
```typescript
// Mock token generation
const token = "mock-token-" + Math.random().toString(36).slice(2);
```

### After Backend Integration
```
JWT Token (from /api/auth/login/)
├── Issued by: Django Rest Framework (djangorestframework-simplejwt)
├── Lifetime: Configurable (default: 5 minutes access, 24h refresh)
├── Format: Authorization: Bearer {token}
└── Refresh: POST /api/auth/refresh/
```

---

## 📝 Notes

- **Current Phase**: Frontend complete with mock data
- **Data Persistence**: In-session only (browser localStorage)
- **Backend**: Django configured with PostgreSQL connection
- **Next Step**: Implement Wallet & Billing endpoints
- **Database**: Already accessible (Neon PostgreSQL)
- **Authentication**: JWT ready (djangorestframework-simplejwt installed)

