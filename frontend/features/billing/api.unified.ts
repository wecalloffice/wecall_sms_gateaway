// features/billing/api.unified.ts
// Unified API layer that supports both mock and real backends
// Aligns with wecallMockData and authoritative types.ts

import type {
  Wallet,
  BillingTransaction,
  PricingPlan,
  RateCard,
  UsageMetrics,
  Invoice,
  BillingAlert,
} from "./types";

import { mockBilling } from "@/mocks/adapters/mockBilling";
import { wecallMockData } from "@/mocks/data/wecallMockData";

const API_BASE = "/api/billing";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_BILLING === "true";

// ============================================
// WALLET
// ============================================

export async function getWallet(businessSid: string): Promise<Wallet | null> {
  try {
    if (USE_MOCK) {
      const wallet = await mockBilling.wallet(businessSid);
      return wallet ?? null;
    }

    const res = await fetch(`${API_BASE}/wallet/${businessSid}/`);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch wallet");
    }
    return res.json();
  } catch (error: any) {
    console.error("getWallet error:", error.message);
    throw error;
  }
}

// ============================================
// TRANSACTIONS
// ============================================

export async function getTransactions(
  businessSid: string,
  limit = 50
): Promise<BillingTransaction[]> {
  try {
    if (USE_MOCK) {
      return await mockBilling.transactions(businessSid);
    }

    const res = await fetch(
      `${API_BASE}/transactions/${businessSid}/?limit=${limit}`
    );
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch transactions");
    }
    return res.json();
  } catch (error: any) {
    console.error("getTransactions error:", error.message);
    throw error;
  }
}

export interface TopupPayload {
  business_sid: string;
  amount: number;
  reference?: string;
}

export async function topUpWallet(payload: TopupPayload): Promise<Wallet> {
  try {
    if (USE_MOCK) {
      // Mock implementation: find wallet, increment balance
      const wallet = await mockBilling.wallet(payload.business_sid);
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      (wallet as any).balance += payload.amount;
      return wallet;
    }

    const res = await fetch(`${API_BASE}/topup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Top-up failed");
    }

    return res.json();
  } catch (error: any) {
    console.error("topUpWallet error:", error.message);
    throw error;
  }
}

// ============================================
// PRICING & RATE CARDS
// ============================================

const mockPricingPlans: PricingPlan[] = [
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
];

const mockRateCards: RateCard[] = [
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
];

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    if (USE_MOCK) {
      return mockPricingPlans;
    }

    const res = await fetch(`${API_BASE}/pricing-plans/`);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch pricing plans");
    }
    return res.json();
  } catch (error: any) {
    console.error("getPricingPlans error:", error.message);
    throw error;
  }
}

export async function getRateCards(): Promise<RateCard[]> {
  try {
    if (USE_MOCK) {
      return mockRateCards;
    }

    const res = await fetch(`${API_BASE}/rate-cards/`);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch rate cards");
    }
    return res.json();
  } catch (error: any) {
    console.error("getRateCards error:", error.message);
    throw error;
  }
}

// ============================================
// USAGE & ANALYTICS
// ============================================

export async function getUsageMetrics(
  businessSid: string,
  period: "TODAY" | "THIS_WEEK" | "THIS_MONTH" = "THIS_MONTH"
): Promise<UsageMetrics> {
  try {
    if (USE_MOCK) {
      // Derive from wecallMockData
      const messages = wecallMockData.messages.filter((m) => m.business_sid === businessSid);
      const delivered = messages.filter((m) => m.status === "delivered").length;
      const failed = messages.filter((m) => m.status === "failed").length;
      const total_cost = messages.reduce((sum, m) => sum + (m.price || 0), 0);

      return {
        business_sid: businessSid,
        period,
        total_messages_sent: messages.length,
        total_messages_delivered: delivered,
        total_messages_failed: failed,
        success_rate: messages.length > 0 ? delivered / messages.length : 0,
        total_cost,
        average_cost_per_message: messages.length > 0 ? total_cost / messages.length : 0,
        top_countries: [
          {
            country_code: "RW",
            country_name: "Rwanda",
            messages_sent: Math.floor(messages.length * 0.7),
            cost: total_cost * 0.7,
          },
        ],
        top_operators: [
          {
            operator: "MTN",
            country: "RW",
            messages_sent: Math.floor(messages.length * 0.5),
            cost: total_cost * 0.5,
          },
        ],
      };
    }

    const res = await fetch(
      `${API_BASE}/usage/${businessSid}/?period=${period}`
    );
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch usage metrics");
    }
    return res.json();
  } catch (error: any) {
    console.error("getUsageMetrics error:", error.message);
    throw error;
  }
}

// ============================================
// INVOICES
// ============================================

export async function getInvoice(
  businessSid: string,
  periodStart: string,
  periodEnd: string
): Promise<Invoice> {
  try {
    if (USE_MOCK) {
      // Mock: create a simple invoice from transactions
      const transactions = await mockBilling.transactions(businessSid);
      const smsDebits = transactions.filter((t) => t.type === "SMS_DEBIT");
      const total_amount = Math.abs(smsDebits.reduce((sum, t) => sum + t.amount, 0));

      return {
        sid: `INV_MOCK_${Math.random().toString(36).slice(2, 9)}`,
        business_sid: businessSid,
        invoice_number: `INV-2025-${Math.floor(Math.random() * 100000)}`,
        period_start: periodStart,
        period_end: periodEnd,
        total_amount,
        currency: "USD",
        status: "SENT",
        line_items: [
          {
            description: "SMS Usage",
            quantity: smsDebits.length,
            unit_price: 0.018,
            total: total_amount,
            category: "SMS",
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const res = await fetch(
      `${API_BASE}/invoices/${businessSid}/?period_start=${periodStart}&period_end=${periodEnd}`
    );
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch invoice");
    }
    return res.json();
  } catch (error: any) {
    console.error("getInvoice error:", error.message);
    throw error;
  }
}

// ============================================
// ALERTS
// ============================================

export async function getBillingAlerts(
  businessSid: string
): Promise<BillingAlert[]> {
  try {
    if (USE_MOCK) {
      const wallet = await mockBilling.wallet(businessSid);
      if (!wallet) return [];

      const alerts: BillingAlert[] = [];

      // Low balance alert
      if (wallet.balance < 100) {
        alerts.push({
          sid: "ALERT_LOW_BAL",
          business_sid: businessSid,
          type: "LOW_BALANCE",
          severity: wallet.balance < 50 ? "CRITICAL" : "WARNING",
          message: `Your balance is low: $${wallet.balance.toFixed(2)}`,
          threshold: 100,
          current_value: wallet.balance,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }

      return alerts;
    }

    const res = await fetch(`${API_BASE}/alerts/${businessSid}/`);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Failed to fetch alerts");
    }
    return res.json();
  } catch (error: any) {
    console.error("getBillingAlerts error:", error.message);
    throw error;
  }
}
