"use client";

import { useMutation } from "@tanstack/react-query";
import { getWallet, getTransactions, topUpWallet } from "@/features/billing/billing.api";


export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegisterBusiness() {
  return useMutation({
    mutationFn: registerBusiness,
  });
}
