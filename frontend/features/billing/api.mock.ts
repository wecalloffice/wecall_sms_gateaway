// features/billing/api.mock.ts
// Mock API layer (deprecated - use api.unified.ts instead)
// Kept for reference only; new code should use api.unified.ts

"use client";

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

// ============================================
// WALLET
// ============================================

export async function getWallet(businessSid: string): Promise<Wallet | null> {
  try {
    const wallet = await mockBilling.wallet(businessSid);
    return wallet ?? null;
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
    const transactions = await mockBilling.transactions(businessSid);
    return transactions.slice(0, limit);
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
    const wallet = await mockBilling.wallet(payload.business_sid);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    (wallet as any).balance += payload.amount;
    return wallet;
  } catch (error: any) {
    console.error("topUpWallet error:", error.message);
    throw error;
  }
}
