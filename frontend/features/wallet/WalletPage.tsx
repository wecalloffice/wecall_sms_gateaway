"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { mockBilling } from "@/mocks/adapters/mockBilling";
import { WalletStats } from "@/components/wallet/WalletStats";
import { TopUpModal } from "@/components/wallet/TopUpModal";
import { TransactionsTable } from "@/components/wallet/TransactionsTable";

export default function ClientWalletPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(485.50);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using placeholder business_sid - replace with actual from context
        const business_sid = "business_123";
        const txns = await mockBilling.transactions(business_sid);
        setTransactions(txns);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTopUp = (amount: number) => {
    setBalance(balance + amount);
    setTransactions([
      {
        sid: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        type: 'Top Up',
        amount,
        date: new Date().toLocaleDateString(),
        reference: 'Top Up',
        status: 'completed',
      },
      ...transactions,
    ]);
    setShowTopUpModal(false);
  };

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="ACME Corp" userName="Client Admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet & Billing</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your balance and transactions</p>
          </div>
          <button onClick={() => setShowTopUpModal(true)} className="btn-primary">Top Up</button>
        </div>

        <WalletStats balance={balance} transactions={transactions} />

        {showTopUpModal && (
          <TopUpModal 
            topUpAmount={topUpAmount}
            setTopUpAmount={setTopUpAmount}
            handleTopUp={handleTopUp}
            closeModal={() => setShowTopUpModal(false)}
          />
        )}

        <TransactionsTable transactions={transactions} loading={loading} />
      </div>
    </MainLayout>
  );
}
