"use client";

import React from "react";
import { useWallet, useTransactions, useTopUpWallet } from "../hooks";
import { WalletCard } from "./wallet-card";
import { TransactionTable } from "./transaction-table";

type Props = {
  businessSid: string; // e.g. AC_CLIENT_2001
};

export const BillingPanelClient: React.FC<Props> = ({ businessSid }) => {
  const walletState = useWallet(businessSid);
  const txState = useTransactions(businessSid);
  const topUp = useTopUpWallet(businessSid);

  const lowBalance =
    walletState.wallet && walletState.wallet.balance < 10;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Client Billing Dashboard</h2>

      {lowBalance && (
        <div className="rounded bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2">
          ⚠ Your balance is low. Please top up to continue sending SMS.
        </div>
      )}

      {/* Wallet */}
      <WalletCard
        wallet={walletState.wallet}
        loading={walletState.loading}
        onTopUp={(amt) => topUp.topUp(amt)}
        topUpLoading={topUp.loading}
      />

      {/* Transactions */}
      <TransactionTable
        transactions={txState.transactions}
        loading={txState.loading}
        smsStats={{
          totalCost:
            txState.transactions
              ?.filter((t) => t.type === "SMS_DEBIT")
              .reduce((s, t) => s + Math.abs(t.amount), 0) ?? 0,
          totalMessages:
            txState.transactions
              ?.filter((t) => t.type === "SMS_DEBIT")
              .length ?? 0,
        }}
      />
    </div>
  );
};
