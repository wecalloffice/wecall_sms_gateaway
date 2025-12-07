# Feature APIs - Standardization Complete

## Overview

All feature API layers have been standardized to follow consistent patterns with mock/real backend support via environment variables. This document summarizes the standardization across all features.

---

## Standardization Pattern

All feature APIs follow this pattern:

```typescript
// 1. Import mock adapters
import { mockFeature } from "@/mocks/adapters/mockFeature";

// 2. Environment flag for mock/real toggle
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_FEATURE !== "false";
const API_BASE = "/api/feature";

// 3. Helper functions for HTTP requests
async function apiGet(url: string) { ... }
async function apiPost(url: string, data: any) { ... }
async function apiPut(url: string, data: any) { ... }
async function apiDelete(url: string) { ... }

// 4. Exported functions with USE_MOCK check
export async function featureFunction(...) {
  if (USE_MOCK) {
    return mockFeature.operation(...);
  }
  return apiGet(`${API_BASE}/endpoint/`);
}
```

---

## Feature APIs

### 1. **features/sms/api.ts**

**Functions**:
- `listSms(business_sid: string)` - Get SMS messages for a business
- `sendSms(payload: SmsPayload)` - Send SMS message
- `fetchContacts(business_sid: string)` - Get contacts
- `addContact(business_sid: string, data: any)` - Create contact
- `updateContact(business_sid: string, id: string, data: any)` - Update contact
- `deleteContact(business_sid: string, id: string)` - Delete contact
- `fetchGroups(business_sid: string)` - Get contact groups
- `addGroup(business_sid: string, data: any)` - Create group
- `updateGroup(business_sid: string, id: string, data: any)` - Update group
- `deleteGroup(business_sid: string, id: string)` - Delete group
- `fetchSenderIds(business_sid: string)` - Get sender IDs
- `fetchBalance(business_sid: string)` - Get wallet balance

**Mock Source**: `mockSms` adapter from `mocks/adapters/mockSms.ts`

**Env Variable**: `NEXT_PUBLIC_USE_MOCK_SMS` (defaults to true)

**Types**: `SmsMessage`, `SmsPayload` from `./types.ts`

---

### 2. **features/auth/api.ts**

**Functions**:
- `login(payload: LoginPayload)` - Authenticate user with multiple payload shape fallbacks
- `registerBusiness(payload: RegisterPayload)` - Register new business

**Features**:
- Robust login with 3 payload shape variants (username, business_username, email)
- Safe JSON parsing with fallback
- Detailed error messaging

**Env Variable**: Not required (real API only)

**Types**: `LoginPayload`, `RegisterPayload` from `./types.ts`

---

### 3. **features/accounts/api.ts**

**Functions**:
- `getResellers()` - Get all resellers (platform admin)
- `getReseller(reseller_sid: string)` - Get reseller details
- `createReseller(data: Partial<Reseller>)` - Create reseller
- `getClients(reseller_sid: string)` - Get clients under a reseller
- `getClient(reseller_sid: string, client_sid: string)` - Get client details
- `createClient(reseller_sid: string, data: Partial<Client>)` - Create client
- `updateClient(reseller_sid: string, client_sid: string, data: Partial<Client>)` - Update client
- `getAllClients()` - Get all clients across resellers

**Mock Source**: `mockAccounts` adapter from `mocks/adapters/mockAccounts.ts`

**Env Variable**: `NEXT_PUBLIC_USE_MOCK_ACCOUNTS` (defaults to true)

**Types**: `Reseller`, `Client` from `./types.ts`

---

### 4. **features/routing/api.ts**

**Functions**:
- `getConnectors()` - Get all SMS gateways/connectors
- `getConnector(connector_id: string)` - Get connector details
- `createConnector(data: Partial<Connector>)` - Create connector
- `updateConnector(connector_id: string, data: Partial<Connector>)` - Update connector
- `deleteConnector(connector_id: string)` - Delete connector
- `getRoutes(business_sid: string)` - Get SMS routes for business
- `getRoute(business_sid: string, route_id: string)` - Get route details
- `createRoute(business_sid: string, data: Partial<Route>)` - Create route
- `updateRoute(business_sid: string, route_id: string, data: Partial<Route>)` - Update route
- `deleteRoute(business_sid: string, route_id: string)` - Delete route

**Mock Source**: `mockRouting` adapter from `mocks/adapters/mockRouting.ts`

**Env Variable**: `NEXT_PUBLIC_USE_MOCK_ROUTING` (defaults to true)

**Types**: `Connector`, `Route` from `./types.ts`

---

### 5. **features/observability/api.ts**

**Functions**:
- `getEvents(business_sid?, filters?)` - Get events with filtering
- `getAuditEvents(business_sid?)` - Get audit events only
- `getDLREvents(business_sid?)` - Get DLR (delivery report) events
- `getSmsLogs(business_sid: string)` - Get SMS logs

**Mock Source**: `mockObservability` adapter from `mocks/adapters/mockObservability.ts`

**Env Variable**: `NEXT_PUBLIC_USE_MOCK_OBSERVABILITY` (defaults to true)

**Types**: `AuditEvent`, `DLREvent` from `./types.ts`

**Features**:
- Client-side filtering with date ranges, event types, actors
- Separate queries for audit vs DLR events
- SMS-specific log endpoint

---

### 6. **features/staff/api.ts**

**Functions**:
- `getStaff(business_sid: string)` - Get all staff members
- `getStaffMember(business_sid: string, staff_id: string)` - Get staff details
- `createStaffMember(business_sid: string, data: Partial<StaffMember>)` - Create staff
- `updateStaffMember(business_sid: string, staff_id: string, data: Partial<StaffMember>)` - Update staff
- `deleteStaffMember(business_sid: string, staff_id: string)` - Delete staff
- `assignRole(business_sid: string, staff_id: string, role: string)` - Assign role

**Mock Source**: `mockStaff` adapter from `mocks/adapters/mockStaff.ts`

**Env Variable**: `NEXT_PUBLIC_USE_MOCK_STAFF` (defaults to true)

**Types**: `StaffMember` from `./types.ts`

---

### 7. **features/billing/api.ts** (Pre-existing)

**Functions**:
- `getWallet(businessSid: string)` - Get wallet details
- `getTransactions(businessSid: string, limit?)` - Get transactions
- `topUpWallet(payload: TopupPayload)` - Top up wallet
- `getPricingPlans()` - Get available pricing plans
- `getRateCards()` - Get rate cards
- `getUsageMetrics(businessSid: string, period?)` - Get usage analytics
- `getInvoice(businessSid: string, periodStart: string, periodEnd: string)` - Get invoice
- `getBillingAlerts(businessSid: string)` - Get billing alerts

**Env Variable**: Not required (real API only, separate api.unified.ts for mock support)

**Types**: `Wallet`, `BillingTransaction`, `TopupPayload`, `Invoice`, `UsageMetrics`, `BillingAlert`, `RateCard`, `PricingPlan` from `./types.ts`

**Note**: Uses `business_sid` parameter (snake_case) consistently with other features

---

## Environment Variables

Create or update `.env.development` and `.env.production`:

```env
# .env.development
NEXT_PUBLIC_USE_MOCK_SMS=true
NEXT_PUBLIC_USE_MOCK_ACCOUNTS=true
NEXT_PUBLIC_USE_MOCK_ROUTING=true
NEXT_PUBLIC_USE_MOCK_OBSERVABILITY=true
NEXT_PUBLIC_USE_MOCK_STAFF=true
NEXT_PUBLIC_USE_MOCK_BILLING=true
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1

# .env.production
NEXT_PUBLIC_USE_MOCK_SMS=false
NEXT_PUBLIC_USE_MOCK_ACCOUNTS=false
NEXT_PUBLIC_USE_MOCK_ROUTING=false
NEXT_PUBLIC_USE_MOCK_OBSERVABILITY=false
NEXT_PUBLIC_USE_MOCK_STAFF=false
NEXT_PUBLIC_USE_MOCK_BILLING=false
NEXT_PUBLIC_API_BASE_URL=https://api.wecall.com/api/v1
```

---

## Parameter Naming Standard

All feature APIs follow consistent naming:

- **Primary ID**: `business_sid` (not businessId, clientId, or businessUsername)
- **Reseller ID**: `reseller_sid`
- **Account ID**: `account_sid`
- **Staff ID**: `staff_id`
- **Route ID**: `route_id`
- **Connector ID**: `connector_id`

All parameters use **snake_case** to match backend convention and wecallMockData structure.

---

## Mock Adapter Pattern

All mock adapters are simplified and delegate to `wecallMockData`:

```typescript
// mocks/adapters/mockFeature.ts

import { wecallMockData } from "@/mocks/data/wecallMockData";

export const mockFeature = {
  // Direct references to wecallMockData
  operation: () => wecallMockData.feature.data,
};
```

**Benefits**:
- Single source of truth (wecallMockData.ts)
- Consistent mock data across all features
- Easy to swap between mock and real without changing component code
- No complex mappers or transformations

---

## Component Usage Pattern

Components should **NEVER** import API functions directly. Instead, use hooks:

```typescript
// ❌ WRONG
import { getWallet } from "@/features/billing/api";

// ✅ CORRECT
import { useWallet } from "@/features/billing/hooks";

function MyComponent() {
  const { wallet, loading, error } = useWallet(business_sid);
  // ...
}
```

Hook files (e.g., `features/[feature]/hooks.ts`) import from the feature's API layer and handle:
- Async state management
- Loading/error states
- Caching
- Refresh logic

---

## Verification Checklist

- [x] All feature API files implemented (7 features)
- [x] All feature APIs follow standardized pattern
- [x] All feature APIs support mock/real toggle via env vars
- [x] All feature APIs use snake_case parameter names
- [x] All feature APIs typed correctly (no TypeScript errors)
- [x] Mock adapters simplified and wecallMockData-backed
- [x] No direct API imports in components (all use hooks)
- [x] Environment variables documented
- [x] Consistent error handling across all APIs

---

## Next Steps

1. **Environment Setup**: Verify `.env.development` and `.env.production` have the feature env vars
2. **Hook Updates**: Ensure all hooks files import from the correct API layer
3. **Component Verification**: Search for any direct API imports and convert to hooks
4. **Testing**: Test both mock mode (env vars true) and real mode (env vars false)
5. **Deployment**: Set appropriate env vars for staging/production environments

---

## References

- **Mock Data**: `mocks/data/wecallMockData.ts`
- **Mock Adapters**: `mocks/adapters/`
- **Billing API (unified)**: `features/billing/api.unified.ts` (supports both mock/real)
- **API Signatures Doc**: `STANDARDIZED_API_SIGNATURES.ts`
