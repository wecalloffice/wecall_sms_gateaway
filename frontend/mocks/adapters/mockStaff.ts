import { wecallMockData } from "../data/wecallMockData";

export const mockStaff = {
  list: async (business_sid) => {
    const reseller = wecallMockData.resellers[0];

    // search staff under reseller clients
    for (const client of reseller.clients) {
      if (client.account_sid === business_sid) return client.staff;
    }

    return [];
  },
};