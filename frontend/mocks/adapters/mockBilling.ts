import { wecallMockData } from "../data/wecallMockData";

export const mockBilling = {
  wallet: async (business_sid) =>
    wecallMockData.billing.wallets.find((w) => w.business_sid === business_sid),

  transactions: async (business_sid) =>
    wecallMockData.billing.transactions.filter(
      (t) => t.business_sid === business_sid
    ),
};
