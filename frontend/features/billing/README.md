# Twilio-like Billing System for WeCall SMS Gateway

## Overview

This comprehensive billing system provides Twilio-like functionality for managing SMS credits, transactions, invoices, pricing, and usage analytics across three user roles: **Client**, **Reseller**, and **Admin**.

## Architecture

### Directory Structure

```
frontend/features/billing/
├── api.ts                           # API layer for billing operations
├── hooks.ts                         # React hooks for billing features
├── types.ts                         # TypeScript types and interfaces
├── components/
│   ├── ClientBillingDashboard.tsx  # Client-facing dashboard
│   ├── ResellerBillingDashboard.tsx # Reseller management dashboard
│   ├── AdminBillingDashboard.tsx    # Admin & pricing management
│   ├── PricingDisplay.tsx           # Pricing plans display
│   ├── RateCardsDisplay.tsx         # Country/operator rate cards
│   ├── UsageAnalytics.tsx           # SMS usage analytics
│   ├── InvoiceDisplay.tsx           # Invoice viewer
│   ├── wallet-card.tsx              # Wallet balance & topup
│   ├── transaction-table.tsx        # Transaction history
│   └── WalletAlerts.tsx             # Billing alerts
└── mocks/adapters/mockBilling.ts   # Mock data adapter
```

## Features

### 1. **Client Dashboard** (`ClientBillingDashboard`)
Designed for end-users managing their SMS billing:

- **Wallet Management**
  - Real-time balance display
  - Auto-recharge configuration
  - Quick top-up with preset amounts ($10, $25, $50, $100, etc.)
  - Credit limit tracking

- **Transaction History**
  - All transaction types (TOPUP, SMS_DEBIT, PAYMENTS)
  - Detailed breakdown per SMS
  - Status tracking (PENDING, COMPLETED, FAILED)

- **Usage Analytics**
  - Daily/Weekly/Monthly message metrics
  - Delivery success rate
  - Cost analysis by country and operator
  - Average cost per SMS

- **Pricing Plans**
  - Available plans with volume discounts
  - Tier-based pricing display
  - Feature comparison

- **Billing Alerts**
  - Low balance warnings
  - Overage notifications
  - Critical alerts

### 2. **Reseller Dashboard** (`ResellerBillingDashboard`)
For resellers managing multiple client accounts:

- **Overview Metrics**
  - Total account balance
  - Number of active clients
  - Monthly volume and revenue
  - Margin income tracking

- **Client Management**
  - List all clients with status
  - Balance and credit limits per client
  - Monthly usage and costs
  - Quick edit actions

- **Margin Management**
  - Set margin percentages per client
  - Track margin income
  - View cost-per-SMS by client
  - Bulk margin adjustments

- **Reseller Wallet**
  - Top-up for account balance
  - Transaction history
  - Auto-recharge settings

### 3. **Admin Dashboard** (`AdminBillingDashboard`)
For platform administrators:

- **Overview Analytics**
  - Total platform revenue
  - Active clients count
  - Average account value
  - Monthly messages sent
  - Delivery rates
  - Outstanding invoices

- **Pricing Management**
  - Create/edit pricing plans
  - Volume tier configuration
  - Plan type selection
  - Feature management

- **Rate Card Management**
  - SMS rates by country
  - Operator-specific pricing
  - Effective date tracking
  - Bulk rate updates

## Data Types

### Core Types

```typescript
// Wallet
type Wallet = {
  sid: string;
  business_sid: string;
  balance: number;
  currency: string;
  credit_limit?: number;
  auto_recharge_enabled?: boolean;
  auto_recharge_amount?: number;
  auto_recharge_threshold?: number;
}

// Transaction
type BillingTransaction = {
  sid: string;
  business_sid: string;
  type: "TOPUP" | "SMS_DEBIT" | "INVOICE_PAYMENT" | "CREDIT_ADJUSTMENT" | "REFUND";
  amount: number;
  currency: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  details?: Record<string, any>;
  created_at: string;
}

// Usage Metrics
type UsageMetrics = {
  total_messages_sent: number;
  total_messages_delivered: number;
  total_messages_failed: number;
  success_rate: number;
  total_cost: number;
  average_cost_per_message: number;
  top_countries?: CountryUsage[];
  top_operators?: OperatorUsage[];
}

// Pricing Plan
type PricingPlan = {
  sid: string;
  name: string;
  type: "PAY_AS_YOU_GO" | "MONTHLY_SUBSCRIPTION" | "VOLUME_DISCOUNT";
  base_price_per_sms: number;
  volume_tiers?: VolumeTier[];
  features?: string[];
}

// Rate Card
type RateCard = {
  country_code: string;
  country_name: string;
  operator: string;
  price_per_sms: number;
  currency: string;
  effective_from: string;
}

// Invoice
type Invoice = {
  invoice_number: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  line_items: InvoiceLineItem[];
  due_date?: string;
  paid_date?: string;
}
```

## React Hooks

### `useWallet(businessSid)`
Manages wallet data and refresh functionality.

```typescript
const { wallet, loading, error, refresh } = useWallet("AC_CLIENT_2001");
```

### `useTransactions(businessSid, limit)`
Fetches transaction history with pagination.

```typescript
const { transactions, loading, error, refresh } = useTransactions("AC_CLIENT_2001", 50);
```

### `useTopUpWallet(businessSid)`
Handles wallet top-up operations.

```typescript
const { topUp, loading, error } = useTopUpWallet("AC_CLIENT_2001");
await topUp(100, "MANUAL_TOPUP");
```

### `useUsageMetrics(businessSid, period)`
Retrieves SMS usage analytics.

```typescript
const { metrics, loading, error } = useUsageMetrics("AC_CLIENT_2001", "THIS_MONTH");
```

### `usePricingPlans()`
Gets available pricing plans.

```typescript
const { plans, loading, error } = usePricingPlans();
```

### `useRateCards()`
Fetches rate cards by country/operator.

```typescript
const { rateCards, loading, error } = useRateCards();
```

### `useBillingAlerts(businessSid)`
Gets active billing alerts.

```typescript
const { alerts, loading, error } = useBillingAlerts("AC_CLIENT_2001");
```

## API Functions

All API functions are in `features/billing/api.ts`:

```typescript
// Wallet operations
getWallet(businessSid): Promise<Wallet>
getTransactions(businessSid, limit): Promise<BillingTransaction[]>
topUpWallet(businessSid, amount, reference): Promise<Wallet>

// Pricing & Rate Cards
getPricingPlans(): Promise<PricingPlan[]>
getRateCards(): Promise<RateCard[]>

// Analytics
getUsageMetrics(businessSid, period): Promise<UsageMetrics>
getInvoice(businessSid, periodStart, periodEnd): Promise<Invoice>

// Alerts
getBillingAlerts(businessSid): Promise<BillingAlert[]>
```

## Mock Data Integration

The system uses mock data from `mocks/data/wecallMockData.ts` which includes:

- **Resellers**: KCB Bank with multiple clients
- **Clients**: Rwanda Development Board, I&M Holdings
- **Transactions**: Sample top-ups and SMS debits
- **SMS Messages**: Sample messages with delivery status
- **Routing**: SMS provider connectors and routes
- **Audit Logs**: Event tracking

See `mock Billings.ts` for adapter implementation.

## Usage Examples

### Client Billing Page

```tsx
import { ClientBillingDashboard } from "@/features/billing";

export default function BillingPage() {
  return (
    <MainLayout>
      <ClientBillingDashboard businessSid="AC_CLIENT_2001" />
    </MainLayout>
  );
}
```

### Reseller View

```tsx
import { ResellerBillingDashboard } from "@/features/billing";

export default function ResellerPage() {
  return (
    <MainLayout>
      <ResellerBillingDashboard businessSid="AC_RESELLER_1001" />
    </MainLayout>
  );
}
```

### Admin View

```tsx
import { AdminBillingDashboard } from "@/features/billing";

export default function AdminPage() {
  return (
    <MainLayout>
      <AdminBillingDashboard businessSid="AC_PLATFORM_0001" />
    </MainLayout>
  );
}
```

## UI Components

### Reusable Components

- **PricingDisplay**: Shows pricing plans with volume tiers
- **RateCardsDisplay**: Displays rate cards with country selector
- **UsageAnalytics**: KPI cards and usage breakdowns
- **InvoiceDisplay**: Invoice viewer with line items
- **WalletCard**: Wallet balance and top-up form
- **TransactionTable**: Sortable transaction history

## Styling

All components use Tailwind CSS with consistent color scheme:

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Purple (#8B5CF6)

## Integration Points

### API Routes

The system connects to these API routes:

```
/api/billing/wallet/[businessId]     # GET wallet
/api/billing/pricing/                 # GET pricing plans
/api/billing/sms/send/                # POST send SMS
/api/billing/topup/                   # POST top-up
/api/billing/transactions/[businessId]# GET transactions
```

### Authentication

Each component expects a valid `businessSid` prop which should be obtained from:

1. User session/context
2. URL params
3. Redux/Zustand store
4. Query parameters

## Future Enhancements

1. **Real Payment Integration**: Stripe, Paystack, Mobile Money
2. **Advanced Analytics**: Charts, trends, predictions
3. **API Access**: REST/GraphQL for programmatic access
4. **Webhooks**: Real-time notifications for events
5. **Bulk Operations**: CSV import/export
6. **Custom Reports**: Flexible reporting engine
7. **Auto-Invoicing**: Automated monthly invoices
8. **API Rate Limiting**: Usage-based quotas
9. **Account Hierarchy**: Sub-resellers support
10. **Multi-Currency**: Global payment support

## Testing

To view all three dashboards:

1. Navigate to `/platform/billing`
2. Use the role selector buttons to switch between:
   - Client Dashboard
   - Reseller Dashboard
   - Admin Dashboard

## Support

For questions or issues, refer to:

- `features/billing/README.md` (this file)
- `BILLING_IMPLEMENTATION.md` (original specs)
- Component files for implementation details
