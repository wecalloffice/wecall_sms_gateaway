import { wecallMockData } from "../data/wecallMockData";

export const mockStaff = {
  list: async (business_sid) => {
    const reseller = wecallMockData.resellers[0];

    // search staff under reseller clients
    for (const client of reseller.clients) {
      if (client.account_sid === business_sid) return client.staff;
    }

<<<<<<< HEAD
    return [];
  },
=======
    return [];
  },
>>>>>>> 0d4d5bf2bbd4eff8d412ceb5964ee9a17dd1e197
};