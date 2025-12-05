// features/billing/api.ts

"use client";

import { Wallet, Transaction } from "./types";

const BASE_URL = "/api/billing";

export async function getWallet(businessId: string): Promise<Wallet> {
  const res = await fetch(`${BASE_URL}/wallet/${businessId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch wallet");
  return res.json();
}

export async function getTransactions(
  businessId: string,
  limit = 50,
  offset = 0
): Promise<Transaction[]> {
  const res = await fetch(
    `${BASE_URL}/transactions/${businessId}?limit=${limit}&offset=${offset}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function topUpWallet(params: {
  businessId: string;
  amount: number;
  description?: string;
  meta?: Record<string, any>;
}): Promise<Wallet> {
  const res = await fetch(`${BASE_URL}/topup`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to top up wallet");
  return res.json();
}
