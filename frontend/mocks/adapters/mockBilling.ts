import { wecallMockData } from "../data/wecallMockData";

const transactions = [...wecallMockData.billing.transactions];
const wallets = [...wecallMockData.billing.wallets];

export const mockBilling = {
  getWallet: async (business_sid: string) => wallets.find((w) => w.business_sid === business_sid) || null,

  listTransactions: async (business_sid?: string) => {
    if (!business_sid) return transactions;
    return transactions.filter((t) => t.business_sid === business_sid);
  },

  createTopup: async (business_sid: string, amount: number, reference?: string) => {
    const sid = "TX" + String(1000 + transactions.length + 1).padStart(4, "0");
    const tx = {
      sid,
      business_sid,
      type: "TOPUP",
      amount,
      currency: "USD",
      reference: reference || `MOCK-TX-${sid}`,
      created_at: new Date().toISOString(),
    };
    transactions.unshift(tx);
    const w = wallets.find((x) => x.business_sid === business_sid);
    if (w) w.balance += amount;
    else wallets.unshift({ sid: `WL-${business_sid}`, business_sid, balance: amount, currency: "USD", credit_limit: 0 });
    return tx;
  },
};
