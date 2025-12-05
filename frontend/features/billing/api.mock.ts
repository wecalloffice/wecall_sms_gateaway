// features/billing/api.mock.ts

"use client";

import { Wallet, Transaction } from "./types";
import { wecallMockData } from "@/mocks/data/wecallMockData";

const BASE_URL = "/api/billing";
const USE_MOCKS = true;

function mapMockWalletToWallet(mock: any): Wallet {
  return {
    id: mock.sid ?? mock.id ?? `${mock.business_sid || mock.businessId}-wallet`,
    businessId: mock.business_sid ?? mock.businessId ?? "",
    balance: String(mock.balance ?? mock.wallet_balance ?? 0),
    currency: mock.currency ?? (mock.billing && mock.billing.currency) ?? "USD",
    createdAt: mock.created_at ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mapMockTxToTransaction(mock: any): Transaction {
  return {
    id: mock.sid ?? mock.id ?? `tx-${Math.random().toString(36).slice(2, 9)}`,
    businessId: mock.business_sid ?? mock.businessId ?? "",
    walletId: mock.wallet_sid ?? null,
    type: (mock.type === "TOPUP" || mock.type === "SMS_DEBIT" || mock.type === "ADJUSTMENT") ? mock.type : "ADJUSTMENT",
    amount: String(mock.amount ?? 0),
    balanceAfter: String(mock.balance_after ?? mock.balanceAfter ?? 0),
    description: mock.reference ?? mock.description ?? null,
    meta: mock.details ?? mock.meta ?? {},
    createdAt: mock.created_at ?? new Date().toISOString(),
  } as Transaction;
}

export async function getWallet(businessId: string): Promise<Wallet> {
  if (USE_MOCKS) {
    const walletEntry = wecallMockData.billing?.wallets?.find((w: any) => w.business_sid === businessId);
    if (walletEntry) return mapMockWalletToWallet(walletEntry);

    const reseller = wecallMockData.resellers?.find((r: any) => r.account_sid === businessId);
    if (reseller) return mapMockWalletToWallet({ sid: `WL_${reseller.account_sid}`, business_sid: reseller.account_sid, balance: reseller.billing?.wallet_balance ?? 0, currency: reseller.billing?.currency ?? "USD" });

    for (const r of wecallMockData.resellers || []) {
      const client = (r.clients || []).find((c: any) => c.account_sid === businessId || c.business_username === businessId);
      if (client) {
        return mapMockWalletToWallet({ sid: `WL_${client.account_sid}`, business_sid: client.account_sid, balance: client.billing?.wallet_balance ?? 0, currency: client.billing?.currency ?? "USD" });
      }
    }

    throw new Error("Mock wallet not found");
  }

  const res = await fetch(`${BASE_URL}/wallet/${businessId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch wallet");
  return res.json();
}

export async function getTransactions(businessId: string, limit = 50, offset = 0): Promise<Transaction[]> {
  if (USE_MOCKS) {
    const all: any[] = wecallMockData.billing?.transactions ?? [];
    const filtered = all.filter((t: any) => t.business_sid === businessId).slice(offset, offset + limit);
    return filtered.map(mapMockTxToTransaction);
  }

  const res = await fetch(`${BASE_URL}/transactions/${businessId}?limit=${limit}&offset=${offset}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function topUpWallet(params: { businessId: string; amount: number; description?: string; meta?: Record<string, any>; }): Promise<Wallet> {
  if (USE_MOCKS) {
    wecallMockData.billing = wecallMockData.billing || {};
    wecallMockData.billing.wallets = wecallMockData.billing.wallets || [];
    wecallMockData.billing.transactions = wecallMockData.billing.transactions || [];

    let w = wecallMockData.billing.wallets.find((x: any) => x.business_sid === params.businessId);
    if (w) {
      w.balance = Number(w.balance) + Number(params.amount);
    } else {
      const newWallet = { sid: `WL_MOCK_${Math.random().toString(36).slice(2,8)}`, business_sid: params.businessId, balance: Number(params.amount), currency: "USD" };
      wecallMockData.billing.wallets.push(newWallet);
      w = newWallet;
    }

    const tx = { sid: `TX_MOCK_${Math.random().toString(36).slice(2,9)}`, business_sid: params.businessId, type: "TOPUP", amount: Number(params.amount), currency: "USD", reference: params.description ?? "MOCK_TOPUP", created_at: new Date().toISOString() };
    wecallMockData.billing.transactions.unshift(tx);

    return mapMockWalletToWallet(w);
  }

  const res = await fetch(`${BASE_URL}/topup`, { method: "POST", body: JSON.stringify(params), headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Failed to top up wallet");
  return res.json();
}
