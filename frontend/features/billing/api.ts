// features/billing/api.ts
import { mockBilling } from "@/mocks/adapters/mockBilling";
import type {
  Wallet,
  BillingTransaction,
  PricingPlan,
  RateCard,
  UsageMetrics,
  Invoice,
  BillingAlert,
} from "./types";

// Use Next.js API routes at /api/billing/*
const API_BASE = "/api/billing";
// Always use real API now (Next.js routes)
const USE_MOCK = false;

// ============================================
// WALLET
// ============================================

export async function getWallet(businessSid: string): Promise<Wallet | null> {
  try {
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

export async function getTransactions(
  businessSid: string,
  limit = 50
): Promise<BillingTransaction[]> {
  try {
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

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
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

