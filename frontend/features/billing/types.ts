<<<<<<< HEAD
// Types for billing and transactions
export interface Transaction {
  id: string;
  amount: number;
  type: string;
  // Add more fields
}

export interface Wallet {
  balance: number;
  currency: string;
}
=======
// features/billing/types.ts

// ============================================
// WALLET & BALANCE
// ============================================
export type Wallet = {
  sid: string;
  business_sid: string;
  balance: number;
  currency: string;
  credit_limit?: number;
  auto_recharge_enabled?: boolean;
  auto_recharge_amount?: number;
  auto_recharge_threshold?: number;
  created_at?: string;
  updated_at?: string;
};

// ============================================
// TRANSACTIONS
// ============================================
export type BillingTransactionType = "TOPUP" | "SMS_DEBIT" | "INVOICE_PAYMENT" | "CREDIT_ADJUSTMENT" | "REFUND" | string;

export type BillingTransaction = {
  sid: string;
  business_sid: string;
  type: BillingTransactionType;
  amount: number;
  currency: string;
  reference?: string;
  details?: Record<string, any>;
  created_at: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  metadata?: Record<string, any>;
};

// ============================================
// PRICING & RATE CARDS
// ============================================
export type PricingPlan = {
  sid: string;
  name: string;
  description: string;
  type: "PREPAID" | "POSTPAID";
  base_price_per_sms: number;
  volume_tiers?: VolumeTier[];
  features?: string[];
  created_at?: string;
  updated_at?: string;
};

export type VolumeTier = {
  min_messages: number;
  max_messages?: number;
  price_per_sms: number;
  discount_percent?: number;
};

export type RateCard = {
  sid: string;
  country_code: string;
  country_name: string;
  operator: string;
  price_per_sms: number;
  currency: string;
  effective_from: string;
  notes?: string;
};

// ============================================
// INVOICES & BILLING HISTORY
// ============================================
export type Invoice = {
  sid: string;
  business_sid: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  currency: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  line_items: InvoiceLineItem[];
  due_date?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category: "SMS" | "MESSAGING_API" | "STORAGE" | "SUPPORT" | "OTHER";
  details?: Record<string, any>;
};

// ============================================
// USAGE & ANALYTICS
// ============================================
export type UsageMetrics = {
  business_sid: string;
  period: "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "CUSTOM";
  total_messages_sent: number;
  total_messages_delivered: number;
  total_messages_failed: number;
  success_rate: number;
  total_cost: number;
  average_cost_per_message: number;
  top_countries?: CountryUsage[];
  top_operators?: OperatorUsage[];
};

export type CountryUsage = {
  country_code: string;
  country_name: string;
  messages_sent: number;
  cost: number;
};

export type OperatorUsage = {
  operator: string;
  country: string;
  messages_sent: number;
  cost: number;
};

// ============================================
// BILLING ALERTS
// ============================================
export type BillingAlert = {
  sid: string;
  business_sid: string;
  type: "LOW_BALANCE" | "BILLING_ALERT" | "OVERAGE_WARNING" | "PAYMENT_DUE";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  threshold?: number;
  current_value?: number;
  is_read: boolean;
  created_at: string;
};

// ============================================
// PAYMENT METHODS
// ============================================
export type PaymentMethod = {
  sid: string;
  business_sid: string;
  type: "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY";
  is_default: boolean;
  last_4_digits?: string;
  provider?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

// ============================================
// BILLING SETTINGS
// ============================================
export type BillingSettings = {
  business_sid: string;
  auto_topup_enabled: boolean;
  auto_topup_amount: number;
  low_balance_threshold: number;
  invoice_frequency: "MONTHLY" | "WEEKLY" | "DAILY";
  default_payment_method_sid?: string;
  billing_email: string;
  tax_id?: string;
  company_name: string;
};

>>>>>>> 32926c17412e5c66b621e64be523f88c89ad76e7
