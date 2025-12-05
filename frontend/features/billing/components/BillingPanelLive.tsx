"use client";

import { useState, useEffect } from "react";
import { useWallet, useTransactions, useTopUpWallet } from "../hooks";
import { wecallMockData } from "../../../mocks/data/wecallMockData";
import { mockSms } from "../../../mocks/adapters/mockSms";
import WalletAlerts from "./WalletAlerts";
import type { BillingTransaction } from "../types";

export default function BillingPanelLive() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsTo, setSmsTo] = useState<string>("+250788123456");
  const [smsText, setSmsText] = useState<string>("Test message from mock");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Use real API hooks
  const { wallet, loading: walletLoading, refresh: refreshWallet } = useWallet(businessId || null);
  const { transactions, loading: txLoading, refresh: refreshTransactions } = useTransactions(businessId || null);
  const { topUp, loading: topUpLoading } = useTopUpWallet(businessId || null);

  // Set default business on mount
  useEffect(() => {
    const firstReseller = wecallMockData.resellers?.[0];
    const firstClient = firstReseller?.clients?.[0];
    setBusinessId(firstClient?.account_sid || firstReseller?.account_sid || null);
  }, []);

  // Build business list
  const businesses: { sid: string; label: string }[] = [];
  for (const r of wecallMockData.resellers || []) {
    businesses.push({ sid: r.account_sid, label: `${r.name} (reseller)` });
    for (const c of r.clients || []) businesses.push({ sid: c.account_sid, label: `${c.name} (client)` });
  }

  // SMS stats for selected business (count and total cost)
  const smsForBusiness = (wecallMockData.messages || []).filter((m: any) => m.business_sid === businessId && m.direction === "outbound");
  const smsCount = smsForBusiness.length;
  const smsTotalCost = smsForBusiness.reduce((sum: number, m: any) => sum + (Number(m.price) || 0), 0);

  // Auto-refresh when messages change for the selected business
  useEffect(() => {
    if (!businessId) return;

    let lastVersion = "";

    const check = () => {
      const msgs = (wecallMockData.messages || []).filter((m: any) => m.business_sid === businessId && m.direction === "outbound");
      const version = `${msgs.length}-${msgs[0]?.created_at ?? ""}-${msgs[0]?.sid ?? ""}`;
      if (version !== lastVersion) {
        lastVersion = version;
        // refresh wallet and transactions when messages change
        try {
          refreshWallet();
        } catch (e) {}
        try {
          refreshTransactions();
        } catch (e) {}
      }
    };

    // initial check
    check();
    const id = setInterval(check, 2000);
    return () => clearInterval(id);
  }, [businessId, refreshWallet, refreshTransactions]);

  async function handleTopUp() {
    if (!businessId || topupAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await topUp(topupAmount, `Top-up of ${topupAmount} USD`);
      if (result) {
        setMessage({ type: "success", text: `Top-up of $${topupAmount} successful!` });
        setTopupAmount(0);
        // Refresh both wallet and transactions
        await refreshWallet();
        await refreshTransactions();
      } else {
        setMessage({ type: "error", text: "Top-up failed" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendMockSms() {
    if (!businessId) {
      setMessage({ type: "error", text: "Please select a business first" });
      return;
    }
    if (!smsTo) {
      setMessage({ type: "error", text: "Please enter a destination number" });
      return;
    }

    setIsSendingSms(true);
    setMessage(null);
    try {
      const res: any = await mockSms.send({ business_sid: businessId, to: smsTo, message: smsText, from: "WECALL" });
      if (res && res.sid) {
        setMessage({ type: "success", text: `Mock SMS sent (${res.sid}) — charged ${res.charged}` });
        // refresh wallet and transactions
        await refreshWallet();
        await refreshTransactions();
      } else {
        setMessage({ type: "error", text: res?.message || res?.error || "Failed to send mock SMS" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to send mock SMS" });
    } finally {
      setIsSendingSms(false);
    }
  }

  const isLoading = walletLoading || txLoading;

  return (
    <div className="space-y-4">
      {/* Wallet Alerts */}
      <WalletAlerts businessId={businessId || ""} wallet={wallet} lowBalanceThreshold={50} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Billing Dashboard</h2>

        <div>
          <label className="text-sm">Business</label>
          <select
            className="border rounded px-2 py-1 ml-2"
            value={businessId ?? ""}
            onChange={(e) => {
              setBusinessId(e.target.value);
              setMessage(null);
            }}
          >
            {businesses.map((b) => (
              <option key={b.sid} value={b.sid}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-600">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Card */}
        <div className="md:col-span-1 border rounded p-4 bg-white shadow-sm">
          <h3 className="font-medium text-gray-700">Wallet Balance</h3>
          {wallet ? (
            <div className="mt-4">
              <div className="text-4xl font-bold text-blue-600">
                {wallet.currency} {wallet.balance.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-2">ID: {wallet.sid}</p>
              {/* SMS summary */}
              <div className="mt-3 text-sm text-gray-600">
                <div>SMS sent: <strong>{smsCount}</strong></div>
                <div>SMS cost (total): <strong>{wallet.currency} {smsTotalCost.toFixed(6)}</strong></div>
              </div>

              <div className="mt-4 border-t pt-4">
                <label className="text-sm font-medium">Top Up Amount</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    className="border rounded px-3 py-2 flex-1 text-sm"
                    placeholder="Enter amount"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(Number(e.target.value))}
                    disabled={topUpLoading}
                  />
                  <button
                    className={`px-4 py-2 rounded text-white text-sm font-medium transition ${
                      topUpLoading || topupAmount <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={handleTopUp}
                    disabled={topUpLoading || topupAmount <= 0}
                  >
                    {topUpLoading ? "Processing..." : "Top Up"}
                  </button>
                </div>
              </div>
              {/* Send Mock SMS */}
              <div className="mt-4 border-t pt-4">
                <label className="text-sm font-medium">Send Mock SMS</label>
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="text"
                    className="border rounded px-3 py-2 text-sm"
                    placeholder="To (e.g. +250788123456)"
                    value={smsTo}
                    onChange={(e) => setSmsTo(e.target.value)}
                    disabled={isSendingSms}
                  />
                  <textarea
                    className="border rounded px-3 py-2 text-sm"
                    placeholder="Message"
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    rows={3}
                    disabled={isSendingSms}
                  />
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded text-white text-sm font-medium transition ${
                        isSendingSms ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                      onClick={handleSendMockSms}
                      disabled={isSendingSms}
                    >
                      {isSendingSms ? "Sending..." : "Send Mock SMS"}
                    </button>
                    <button
                      className="px-4 py-2 rounded text-sm border"
                      onClick={() => { setSmsTo("+250788123456"); setSmsText("Test message from mock"); }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-2">No wallet found. Create one first.</p>
          )}
        </div>

        {/* Transactions Table */}
        <div className="md:col-span-2 border rounded p-4 bg-white shadow-sm">
          <h3 className="font-medium text-gray-700">Recent Transactions</h3>
          <div className="mt-4 overflow-x-auto">
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-600">No transactions yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-right p-2 font-medium">Amount</th>
                    <th className="text-left p-2 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t: BillingTransaction) => (
                    <tr key={t.sid} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-xs">
                        {new Date(t.created_at).toLocaleDateString()} {new Date(t.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            t.type === "TOPUP"
                              ? "bg-green-100 text-green-800"
                              : t.type === "SMS_DEBIT"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="p-2 text-right font-semibold">${Math.abs(t.amount).toFixed(2)}</td>
                      <td className="p-2 text-xs">{t.reference || "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
