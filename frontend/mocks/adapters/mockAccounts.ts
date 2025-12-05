import { wecallMockData } from "../data/wecallMockData";

export const mockAccounts = {
  getResellers: async () => wecallMockData.resellers,
  getClients: async (reseller_sid) =>
    wecallMockData.resellers
      .find((r) => r.account_sid === reseller_sid)
      ?.clients || [],
};
<<<<<<< HEAD
=======


>>>>>>> 0d4d5bf2bbd4eff8d412ceb5964ee9a17dd1e197
