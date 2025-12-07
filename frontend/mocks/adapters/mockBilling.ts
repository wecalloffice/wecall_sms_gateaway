// mocks/adapters/mockBilling.ts
import { wecallMockData } from "../data/wecallMockData";
import type {
  Wallet,
  BillingTransaction,
  PricingPlan,
  RateCard,
  Invoice,
  UsageMetrics,
  BillingAlert,
  PaymentMethod,
} from "@/features/billing/types";

let txCounter = 1000;
let invoiceCounter = 100000;

function createTransactionId() {
  txCounter += 1;
  return `TX${txCounter}`;
}

function createInvoiceNumber() {
  invoiceCounter += 1;
  return `INV-2025-${invoiceCounter}`;
}

function findOrCreateWallet(business_sid: string): Wallet {
  let wallet = wecallMockData.billing.wallets.find(
    (w) => w.business_sid === business_sid
  ) as Wallet | undefined;

  if (!wallet) {
    wallet = {
      sid: `WL_${business_sid}`,
      business_sid,
      balance: Math.random() * 5000,
      currency: "USD",
      credit_limit: 10000,
      auto_recharge_enabled: Math.random() > 0.5,
      auto_recharge_amount: 500,
      auto_recharge_threshold: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    wecallMockData.billing.wallets.push({ ...wallet, credit_limit: wallet.credit_limit ?? 0 });
  }

  return wallet;
}

// Sample pricing plans (Twilio-like)
const pricingPlans: PricingPlan[] = [
  {
    sid: "PLAN_PAYGO",
    name: "Pay As You Go",
    description: "Pay only for what you use",
    type: "PREPAID",
    base_price_per_sms: 0.0075,
    volume_tiers: [
      { min_messages: 0, max_messages: 50000, price_per_sms: 0.0075 },
      { min_messages: 50001, max_messages: 100000, price_per_sms: 0.007, discount_percent: 7 },
      { min_messages: 100001, price_per_sms: 0.006, discount_percent: 20 },
    ],
  },
  {
    sid: "PLAN_STARTER",
    name: "Starter Plan",
    description: "1M messages/month included",
    type: "POSTPAID",
    base_price_per_sms: 0.005,
  },
];

// Sample rate cards by country/operator
const rateCards: RateCard[] = [
  {
    sid: "RC_RW_MTN",
    country_code: "RW",
    country_name: "Rwanda",
    operator: "MTN",
    price_per_sms: 0.009,
    currency: "USD",
    effective_from: "2025-01-01",
  },
  {
    sid: "RC_RW_AIRTEL",
    country_code: "RW",
    country_name: "Rwanda",
    operator: "Airtel",
    price_per_sms: 0.008,
    currency: "USD",
    effective_from: "2025-01-01",
  },
  {
    sid: "RC_RW_TIGO",
    country_code: "RW",
    country_name: "Rwanda",
    operator: "Tigo",
    price_per_sms: 0.009,
    currency: "USD",
    effective_from: "2025-01-01",
  },
  {
    sid: "RC_UG_MTN",
    country_code: "UG",
    country_name: "Uganda",
    operator: "MTN",
    price_per_sms: 0.01,
    currency: "USD",
    effective_from: "2025-01-01",
  },
];

export const mockBilling = {
  // 👉 Get current wallet for a business
  wallet: async (business_sid: string): Promise<Wallet | undefined> => {
    return findOrCreateWallet(business_sid);
  },

  // 👉 Get all transactions for a business
  transactions: async (
    business_sid: string
  ): Promise<BillingTransaction[]> => {
    return wecallMockData.billing.transactions.filter(
      (t) => t.business_sid === business_sid
    ) as BillingTransaction[];
  },

  // 👉 Top-up wallet: add money & record TOPUP transaction
  topup: async (
    business_sid: string,
    amount: number,
    reference?: string
  ): Promise<Wallet> => {
    const wallet = findOrCreateWallet(business_sid);
    wallet.balance += amount;
    wallet.updated_at = new Date().toISOString();

    const tx: BillingTransaction = {
      sid: createTransactionId(),
      business_sid,
      type: "TOPUP",
      amount,
      currency: wallet.currency,
      reference: reference ?? "MANUAL_TOPUP",
      created_at: new Date().toISOString(),
      status: "COMPLETED",
    };

    wecallMockData.billing.transactions.push(tx as any);
    return wallet;
  },

  // 👉 Debit wallet when SMS is sent: subtract money & record SMS_DEBIT
  debitForSms: async (
    business_sid: string,
    amount: number,
    details?: Record<string, any>
  ): Promise<Wallet> => {
    const wallet = findOrCreateWallet(business_sid);

    // simple credit limit check
    const available = wallet.balance + (wallet.credit_limit ?? 0);
    if (available < amount) {
      throw new Error("Insufficient balance");
    }

    wallet.balance -= amount;
    wallet.updated_at = new Date().toISOString();

    const tx: BillingTransaction = {
      sid: createTransactionId(),
      business_sid,
      type: "SMS_DEBIT",
      amount: -Math.abs(amount),
      currency: wallet.currency,
      details,
      created_at: new Date().toISOString(),
      status: "COMPLETED",
    };

    wecallMockData.billing.transactions.push(tx as any);
    return wallet;
  },

  // 👉 Get pricing plans
  getPricingPlans: async (): Promise<PricingPlan[]> => {
    return pricingPlans;
  },

  // 👉 Get rate cards
  getRateCards: async (): Promise<RateCard[]> => {
    return rateCards;
  },

  // 👉 Get usage metrics for a business
  getUsageMetrics: async (
    business_sid: string,
    period: "TODAY" | "THIS_WEEK" | "THIS_MONTH" = "THIS_MONTH"
  ): Promise<UsageMetrics> => {
    const transactions = await mockBilling.transactions(business_sid);
    const smsDebits = transactions.filter((t) => t.type === "SMS_DEBIT");

    const total_cost = Math.abs(
      smsDebits.reduce((sum, t) => sum + t.amount, 0)
    );
    const total_messages_sent = smsDebits.reduce((sum, t) => {
      return sum + (t.details?.messages || 1);
    }, 0);

    return {
      business_sid,
      period,
      total_messages_sent,
      total_messages_delivered: Math.floor(total_messages_sent * 0.97),
      total_messages_failed: Math.floor(total_messages_sent * 0.03),
      success_rate: 0.97,
      total_cost,
      average_cost_per_message:
        total_messages_sent > 0 ? total_cost / total_messages_sent : 0,
      top_countries: [
        {
          country_code: "RW",
          country_name: "Rwanda",
          messages_sent: Math.floor(total_messages_sent * 0.6),
          cost: total_cost * 0.6,
        },
        {
          country_code: "UG",
          country_name: "Uganda",
          messages_sent: Math.floor(total_messages_sent * 0.4),
          cost: total_cost * 0.4,
        },
      ],
      top_operators: [
        {
          operator: "MTN",
          country: "RW",
          messages_sent: Math.floor(total_messages_sent * 0.5),
          cost: total_cost * 0.5,
        },
        {
          operator: "Airtel",
          country: "RW",
          messages_sent: Math.floor(total_messages_sent * 0.35),
          cost: total_cost * 0.35,
        },
      ],
    };
  },

  // 👉 Generate invoice for a billing period
  generateInvoice: async (
    business_sid: string,
    period_start: string,
    period_end: string
  ): Promise<Invoice> => {
    const transactions = await mockBilling.transactions(business_sid);
    const smsDebits = transactions.filter(
      (t) =>
        t.type === "SMS_DEBIT" &&
        t.created_at >= period_start &&
        t.created_at <= period_end
    );

    const total_amount = Math.abs(
      smsDebits.reduce((sum, t) => sum + t.amount, 0)
    );
    const total_messages = smsDebits.reduce((sum, t) => {
      return sum + (t.details?.messages || 1);
    }, 0);

    return {
      sid: `INV_${business_sid}_${Date.now()}`,
      business_sid,
      invoice_number: createInvoiceNumber(),
      period_start,
      period_end,
      total_amount,
      currency: "USD",
      status: "SENT",
      line_items: [
        {
          description: `${total_messages} SMS messages`,
          quantity: total_messages,
          unit_price: total_messages > 0 ? total_amount / total_messages : 0,
          total: total_amount,
          category: "SMS",
          details: { messages: total_messages },
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  // 👉 Get billing alerts
  getBillingAlerts: async (business_sid: string): Promise<BillingAlert[]> => {
    const wallet = await mockBilling.wallet(business_sid);
    const alerts: BillingAlert[] = [];

    if (wallet && wallet.balance < (wallet.auto_recharge_threshold || 100)) {
      alerts.push({
        sid: `ALERT_${business_sid}_LOW`,
        business_sid,
        type: "LOW_BALANCE",
        severity: "WARNING",
        message: `Your account balance is low (${wallet.balance.toFixed(2)} ${wallet.currency})`,
        threshold: wallet.auto_recharge_threshold,
        current_value: wallet.balance,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    return alerts;
  },
};
