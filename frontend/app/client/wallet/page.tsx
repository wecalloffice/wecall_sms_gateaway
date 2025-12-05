'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Wallet, DollarSign, TrendingDown, ArrowUpRight } from 'lucide-react';
import { mockBilling } from '@/mocks/adapters/mockBilling';

export default function ClientWalletPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(485.50);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txns = await mockBilling.listTransactions();
        setTransactions(txns);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTopUp = () => {
    if (topUpAmount) {
      const amount = parseFloat(topUpAmount);
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
      setTopUpAmount('');
      setShowTopUpModal(false);
    }
  };

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="ACME Corp" userName="Client Admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet & Billing</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your balance and transactions</p>
          </div>
          <button onClick={() => setShowTopUpModal(true)} className="btn-primary flex items-center gap-2">
            <DollarSign size={20} />
            Top Up
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${balance.toFixed(2)}</p>
              </div>
              <Wallet size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">$234.50</p>
              </div>
              <TrendingDown size={32} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$89.00</p>
              </div>
              <DollarSign size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
              </div>
              <ArrowUpRight size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6 max-w-sm w-full mx-4 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Up Wallet</h3>
              <input
                type="number"
                placeholder="Enter amount ($)"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="input-field w-full mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  className="flex-1 btn-primary"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 transition-colors">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700 transition-colors">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn.sid} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{txn.sid}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          txn.type === 'Top Up' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span className={txn.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {txn.amount >= 0 ? '+' : ''}{txn.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{txn.reference || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
