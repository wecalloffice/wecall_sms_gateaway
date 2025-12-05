"use server";

import axios from "@/lib/axiosInstance";

export async function getWallet(businessId: string) {
  const res = await axios.get(`/billing/wallet/${businessId}`);
  return res.data;
}

export async function getTransactions(businessId: string) {
  const res = await axios.get(`/billing/transactions/${businessId}`);
  return res.data;
}

export async function topUpWallet(businessId: string, amount: number) {
  const res = await axios.post(`/billing/topup`, {
    businessId,
    amount,
  });
  return res.data;
}
