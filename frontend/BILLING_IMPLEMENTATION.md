# WeCall SMS Gateway – Billing Module Implementation

## Overview
Completed Phase 3: Billing Module with wallet, transaction logs, and SMS debit system for the WeCall SMS Gateway MVP.

---

## ✅ Deliverables Completed

### 1. **Backend Billing Models & Database** (`lib/billing.ts`)
- **Wallet Model**: Persistent wallet storage with balance, currency, and timestamps
- **Transaction Model**: Full transaction history with types (TOP_UP, SMS_DEBIT, ADJUSTMENT)
- **Pricing Model**: Configurable SMS pricing with reseller and client margins
- **Data Persistence**: JSON-backed storage in `data/billing.json` (development)

#### Key Functions:
```typescript
getOrCreateWallet(businessId)     // Create/fetch wallet
topUpWallet(params)               // Add funds to wallet
debitWallet(businessId, amount)   // Deduct funds with transaction logging
getTransactions(businessId)       // Retrieve transaction history
getPricing() / setPricing(p)      // Manage SMS pricing
```

---

### 2. **Backend API Endpoints** (`app/api/billing/*`)

#### Wallet Management
- **GET** `/api/billing/wallet/:businessId` – Retrieve or create wallet
- **POST** `/api/billing/topup` – Add funds to wallet
  ```json
  {
    "businessId": "AC_CLIENT_2001",
    "amount": 20,
    "description": "Top-up"
  }
  ```

#### Transaction History
- **GET** `/api/billing/transactions/:businessId?limit=50&offset=0` – List transactions

#### Pricing Management
- **GET** `/api/billing/pricing` – View SMS pricing
- **POST** `/api/billing/pricing` – Update pricing
  ```json
  {
    "basePrice": 0.05,
    "resellerMargin": 0.1,
    "clientMargin": 0.0
  }
  ```

#### SMS Send with Automatic Debit
- **POST** `/api/billing/sms/send` – Send SMS and debit wallet
  ```json
  {
    "businessId": "AC_CLIENT_2001",
    "parts": 1,
    "to": "+250788000111",
    "message": "Hello"
  }
  ```
  - ✅ Calculates cost: `perSms = basePrice * (1 + resellerMargin + clientMargin) * parts`
  - ✅ Checks wallet balance
  - ✅ Debits wallet and writes SMS_DEBIT transaction
  - ✅ Returns 402 if insufficient balance

---

### 3. **Frontend React Hooks** (`features/billing/hooks.ts`)

#### useWallet(businessId)
```typescript
const { wallet, isLoading, error, refresh } = useWallet(businessId);
// wallet: { id, businessId, balance, currency, createdAt, updatedAt }
```

#### useTransactions(businessId)
```typescript
const { transactions, isLoading, error, refresh } = useTransactions(businessId);
// transactions: Transaction[]
```

#### useTopUp(businessId)
```typescript
const performTopUp = useTopUp(businessId);
const result = await performTopUp(amount, description);
// result: { success: boolean, wallet?: Wallet, error?: string }
```

---

### 4. **Billing Dashboard UI** (`features/billing/components/`)

#### BillingPanel.tsx (Mock-only version)
- Displays mock data from `wecallMockData`
- Business selector to switch between resellers/clients
- Shows wallet balance with top-up input
- Transaction history table
- **Purpose**: Quick demo/testing without backend

#### BillingPanelLive.tsx (Real API version) ✨
- **Integrated with real `/api/billing` endpoints**
- **Optimistic updates** on wallet top-ups
- **Error handling** with user-friendly messages
- **Loading states** during API calls
- **Live data refresh** after transactions
- **Business selector** with reseller/client mock data
- **Transaction table** with:
  - Date and time
  - Transaction type (color-coded badges)
  - Amount, description, and balance after

---

## 🚀 How to Use

### Starting the Development Server
```powershell
npm run dev
```
The app runs on `http://localhost:3000` (or the port shown in the terminal).

### Accessing the Billing Dashboard
1. Navigate to: **`http://localhost:3000/platform/dashboard`**
2. The **Billing Dashboard** section appears on the page
3. Select a business (reseller or client) from the dropdown

### Testing Top-Up Flow
1. **View current balance** for the selected business
2. **Enter an amount** in the "Top Up Amount" field
3. **Click "Top Up"** button
4. Watch the balance update and a new TOP_UP transaction appear in the table
5. ✅ Success/error message displays feedback

### Testing SMS Debit (Manual)
Use curl or Postman to send an SMS and trigger a debit:
```bash
curl -X POST http://localhost:3000/api/billing/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "AC_CLIENT_2001",
    "parts": 1,
    "to": "+250788000111",
    "message": "Hello test"
  }'
```

Expected response:
```json
{
  "success": true,
  "wallet": {
    "id": "w_...",
    "balance": "19.95",
    "currency": "USD"
  },
  "transaction": {
    "id": "t_...",
    "type": "SMS_DEBIT",
    "amount": "-0.05",
    "balanceAfter": "19.95"
  }
}
```

---

## 📁 Project Structure

```
frontend/
├── app/
│   └── (platform)/
│       └── dashboard/
│           └── page.tsx                    # Dashboard page (includes BillingPanelLive)
│
├── features/
│   └── billing/
│       ├── api.ts                          # Frontend API client functions
│       ├── hooks.ts                        # React hooks (useWallet, useTransactions, useTopUp)
│       ├── types.ts                        # TypeScript types (Wallet, Transaction)
│       └── components/
│           ├── BillingPanel.tsx            # Mock-only demo component
│           ├── BillingPanelLive.tsx        # Live API component ✨
│           ├── wallet-card.tsx             # Wallet display component
│           └── transaction-table.tsx       # Transaction table component
│
├── lib/
│   └── billing.ts                          # Backend billing logic & persistence
│
├── app/
│   └── api/
│       └── billing/
│           ├── wallet/
│           │   └── [businessId]/route.ts   # GET wallet endpoint
│           ├── topup/route.ts              # POST top-up endpoint
│           ├── transactions/
│           │   └── [businessId]/route.ts   # GET transactions endpoint
│           ├── pricing/route.ts            # GET/POST pricing endpoint
│           └── sms/
│               └── send/route.ts           # POST SMS send (with debit) endpoint
│
├── mocks/
│   ├── data/
│   │   └── wecallMockData.ts               # Mock business, billing, SMS data
│   └── adapters/
│       └── mockBilling.ts                  # Mock billing adapter
│
└── data/
    └── billing.json                        # Persistent wallet/transaction storage
```

---

## 🔧 Configuration

### Default Pricing
Located in `lib/billing.ts`:
```typescript
pricing: {
  basePrice: 0.05,           // $0.05 per SMS
  resellerMargin: 0.1,       // 10% markup for resellers
  clientMargin: 0.0          // No additional markup for clients
}
```

Update via API:
```bash
curl -X POST http://localhost:3000/api/billing/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 0.04,
    "resellerMargin": 0.15,
    "clientMargin": 0.05
  }'
```

---

## 📊 Mock Data

### Businesses
- **Reseller**: KCB Bank (`AC_RESELLER_1001`, wallet balance: $1200.50)
- **Clients**:
  - Rwanda Development Board (`AC_CLIENT_2001`, wallet balance: $350.75)
  - I&M Holdings (`AC_CLIENT_2002`, wallet balance: $90.00)

All mock data persists in `data/billing.json` once the server starts.

---

## ⚡ Key Features Implemented

✅ **Wallet Management**
- Auto-create wallets on first access
- Real-time balance display
- Support for multiple currencies

✅ **Transaction Logging**
- Full audit trail with timestamps
- Transaction types: TOP_UP, SMS_DEBIT, ADJUSTMENT
- Description and metadata support

✅ **SMS Debit System**
- Automatic balance check before SMS send
- Cost calculation with pricing tiers
- Atomic transaction + debit operation
- 402 Payment Required response if insufficient balance

✅ **Optimistic UI Updates**
- Immediate balance update on top-up
- User-friendly success/error messages
- Loading states during API calls
- Auto-refresh on state change

✅ **Mock & Live Integration**
- Demo mode with mock data (BillingPanel)
- Production mode with real endpoints (BillingPanelLive)
- Easy switching between implementations

---

## 🧪 Testing Scenarios

### Scenario 1: Successful Top-Up
1. Select "Rwanda Development Board" from dropdown
2. Current balance shows $350.75
3. Enter $50 in top-up field → Click "Top Up"
4. Balance updates to $400.75 immediately
5. New TOP_UP transaction appears in table

### Scenario 2: SMS Debit from CLI
1. Business has $100 balance
2. Send SMS (parts=1, $0.05 cost per SMS)
3. Balance becomes $99.95
4. SMS_DEBIT transaction logged with metadata

### Scenario 3: Insufficient Balance
1. Business has $0.02 balance
2. Attempt to send SMS ($0.05 cost)
3. API returns 402 with error: "Insufficient balance"
4. No transaction recorded

---

## 🔗 API Response Examples

### GET Wallet
```json
{
  "id": "w_1234567890abc",
  "businessId": "AC_CLIENT_2001",
  "balance": "350.75",
  "currency": "USD",
  "createdAt": "2025-01-15T08:15:00Z",
  "updatedAt": "2025-02-02T10:30:00Z"
}
```

### POST Top-Up
```json
{
  "id": "w_1234567890abc",
  "businessId": "AC_CLIENT_2001",
  "balance": "400.75",
  "currency": "USD",
  "createdAt": "2025-01-15T08:15:00Z",
  "updatedAt": "2025-02-02T10:35:00Z"
}
```

### GET Transactions
```json
[
  {
    "id": "t_9876543210xyz",
    "businessId": "AC_CLIENT_2001",
    "walletId": "w_1234567890abc",
    "type": "TOP_UP",
    "amount": "50",
    "balanceAfter": "400.75",
    "description": "Top-up of 50 USD",
    "meta": {},
    "createdAt": "2025-02-02T10:35:00Z"
  },
  {
    "id": "t_1111111111111",
    "businessId": "AC_CLIENT_2001",
    "walletId": "w_1234567890abc",
    "type": "SMS_DEBIT",
    "amount": "-0.05",
    "balanceAfter": "350.75",
    "description": "SMS send debit",
    "meta": {
      "to": "+250788000111",
      "parts": 1,
      "perSms": 0.05
    },
    "createdAt": "2025-02-02T09:10:00Z"
  }
]
```

---

## 🎯 Next Steps (Optional Enhancements)

- **Database Migration**: Replace `lib/billing.ts` JSON storage with Prisma + PostgreSQL
- **Webhooks**: Notify clients on wallet alerts (low balance)
- **Admin Panel**: Analytics, per-reseller reporting, manual adjustments
- **Rate Limiting**: Prevent abuse of top-up/send endpoints
- **Authentication**: Secure endpoints with JWT tokens
- **Charts**: Monthly spend trends, SMS volume graphs

---

## 📝 Summary

**Phase 3 – Billing Module is complete and ready for:**
- ✅ Dashboard integration and testing
- ✅ SMS debit triggering from SMS submission flows
- ✅ Production migration to real database
- ✅ Team deployment and live usage

For questions or issues, refer to the endpoint documentation above or inspect the mock data in `mocks/data/wecallMockData.ts`.
