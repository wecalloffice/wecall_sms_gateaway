import { wecallMockData } from "../data/wecallMockData";

export const mockAccounts = {
  getResellers: async () => wecallMockData.resellers,
  getClients: async (reseller_sid) =>
    wecallMockData.resellers
      .find((r) => r.account_sid === reseller_sid)
      ?.clients || [],
};


