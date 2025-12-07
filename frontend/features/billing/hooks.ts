// features/billing/hooks.ts
"use client";

import { useCallback, useState, useEffect } from "react";
import {
  getWallet,
  getTransactions,
  topUpWallet,
  getPricingPlans,
  getRateCards,
  getUsageMetrics,
  getInvoice,
  getBillingAlerts,
  type TopupPayload,
} from "./api.unified";
import type {
  Wallet,
  BillingTransaction,
  PricingPlan,
  RateCard,
  UsageMetrics,
  Invoice,
  BillingAlert,
} from "./types";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// ============================================
// useWallet
// ============================================

export function useWallet(businessSid: string | null) {
  const [state, setState] = useState<AsyncState<Wallet>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!businessSid) return;
    setState({ data: null, loading: true, error: null });

    try {
      const wallet = await getWallet(businessSid);
      setState({ data: wallet, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch wallet",
      });
    }
  }, [businessSid]);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { wallet: state.data, loading: state.loading, error: state.error, refresh };
}

// ============================================
// useTransactions
// ============================================

export function useTransactions(businessSid: string | null, limit = 50) {
  const [state, setState] = useState<AsyncState<BillingTransaction[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!businessSid) return;
    setState({ data: null, loading: true, error: null });

    try {
      const transactions = await getTransactions(businessSid, limit);
      setState({ data: transactions, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch transactions",
      });
    }
  }, [businessSid, limit]);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    transactions: state.data ?? [],
    loading: state.loading,
    error: state.error,
    refresh,
  };
}

// ============================================
// useTopupWallet (mutation pattern)
// ============================================

export function useTopupWallet(businessSid: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mutate = useCallback(
    async (amount: number, reference?: string) => {
      if (!businessSid) {
        setError("Business SID required");
        return null;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const payload: TopupPayload = {
          business_sid: businessSid,
          amount,
          reference,
        };
        const wallet = await topUpWallet(payload);
        setSuccess(`Top-up of $${amount} successful`);
        setLoading(false);
        return wallet;
      } catch (err: any) {
        setError(err?.message || "Top-up failed");
        setLoading(false);
        return null;
      }
    },
    [businessSid]
  );

  return { mutate, loading, error, success };
}

// Backwards-compatible alias: some components import `useTopUpWallet` (capital U)
// so provide the alias to avoid ReferenceError at runtime.
export const useTopUpWallet = useTopupWallet;

// ============================================
// usePricingPlans
// ============================================

export function usePricingPlans() {
  const [state, setState] = useState<AsyncState<PricingPlan[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const plans = await getPricingPlans();
      setState({ data: plans, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch pricing plans",
      });
    }
  }, []);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    plans: state.data ?? [],
    loading: state.loading,
    error: state.error,
    refresh,
  };
}

// ============================================
// useRateCards
// ============================================

export function useRateCards() {
  const [state, setState] = useState<AsyncState<RateCard[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const cards = await getRateCards();
      setState({ data: cards, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch rate cards",
      });
    }
  }, []);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    rateCards: state.data ?? [],
    loading: state.loading,
    error: state.error,
    refresh,
  };
}

// ============================================
// useUsageMetrics
// ============================================

export function useUsageMetrics(
  businessSid: string | null,
  period: "TODAY" | "THIS_WEEK" | "THIS_MONTH" = "THIS_MONTH"
) {
  const [state, setState] = useState<AsyncState<UsageMetrics>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!businessSid) return;
    setState({ data: null, loading: true, error: null });

    try {
      const metrics = await getUsageMetrics(businessSid, period);
      setState({ data: metrics, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch usage metrics",
      });
    }
  }, [businessSid, period]);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { metrics: state.data, loading: state.loading, error: state.error, refresh };
}

// ============================================
// useInvoice
// ============================================

export function useInvoice(
  businessSid: string | null,
  periodStart: string | null,
  periodEnd: string | null
) {
  const [state, setState] = useState<AsyncState<Invoice>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!businessSid || !periodStart || !periodEnd) return;
    setState({ data: null, loading: true, error: null });

    try {
      const invoice = await getInvoice(businessSid, periodStart, periodEnd);
      setState({ data: invoice, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch invoice",
      });
    }
  }, [businessSid, periodStart, periodEnd]);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { invoice: state.data, loading: state.loading, error: state.error, refresh };
}

// ============================================
// useBillingAlerts
// ============================================

export function useBillingAlerts(businessSid: string | null) {
  const [state, setState] = useState<AsyncState<BillingAlert[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!businessSid) return;
    setState({ data: null, loading: true, error: null });

    try {
      const alerts = await getBillingAlerts(businessSid);
      setState({ data: alerts, loading: false, error: null });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error?.message || "Failed to fetch alerts",
      });
    }
  }, [businessSid]);

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    alerts: state.data ?? [],
    loading: state.loading,
    error: state.error,
    refresh,
  };
}



