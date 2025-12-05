import { wecallMockData } from "../data/wecallMockData";

export const mockAuth = {
  login: async (username: string, password: string) => {
    const token = "mock-token-" + Math.random().toString(36).slice(2);

    // Check if user exists in registered accounts
    const registeredAccounts = JSON.parse(localStorage.getItem("mockAccounts") || "[]");
    const registeredUser = registeredAccounts.find(
      (acc: any) => acc.business_username === username
    );

    if (registeredUser) {
      // Return based on registered account type
      let role = "CLIENT_ADMIN";
      if (registeredUser.business_type === "RESELLER") {
        role = "RESELLER_ADMIN";
      }
      
      return {
        token,
        user: {
          username,
          role,
          account_sid: registeredUser.account_sid,
          name: registeredUser.business_name,
          parent_reseller: registeredUser.parent_reseller || null,
          business_type: registeredUser.business_type,
        },
      };
    }

    // Fall back to demo accounts
    let role = "RESELLER_ADMIN";
    let account_sid = "AC_RESELLER_1001";

    if (/platform|admin/i.test(username)) {
      role = "PLATFORM_ADMIN";
      account_sid = wecallMockData.platform_account.account_sid;
    } else if (/rdb|imhold|client/i.test(username)) {
      role = "CLIENT_ADMIN";
      account_sid = wecallMockData.resellers[0].clients[0].account_sid;
    }

    return {
      token,
      user: {
        username,
        role,
        account_sid,
        name: username,
      },
    };
  },

  register: async (payload: any) => {
    // Create new account entry
    const newAccount = {
      ...payload,
      created_at: new Date().toISOString(),
      account_sid: `AC_${payload.business_username.toUpperCase()}`,
    };

    // Store in mock accounts
    const existingAccounts = JSON.parse(localStorage.getItem("mockAccounts") || "[]");
    const accountExists = existingAccounts.some(
      (acc: any) => acc.business_username === payload.business_username
    );

    if (accountExists) {
      throw new Error("Username already exists");
    }

    existingAccounts.push(newAccount);
    localStorage.setItem("mockAccounts", JSON.stringify(existingAccounts));

    return { success: true, account: newAccount };
  },

  // Get all sub-accounts for a reseller
  getSubAccounts: async (parentUsername: string) => {
    const allAccounts = JSON.parse(localStorage.getItem("mockAccounts") || "[]");
    return allAccounts.filter((acc: any) => acc.parent_reseller === parentUsername);
  },

  // Upgrade a client to reseller
  upgradeToReseller: async (username: string, resellerDetails: any) => {
    const allAccounts = JSON.parse(localStorage.getItem("mockAccounts") || "[]");
    const account = allAccounts.find((acc: any) => acc.business_username === username);

    if (!account) {
      throw new Error("Account not found");
    }

    if (account.business_type === "RESELLER") {
      throw new Error("Already a reseller");
    }

    account.business_type = "RESELLER";
    account.reseller_details = {
      ...resellerDetails,
      sub_clients: account.reseller_details?.sub_clients || [],
      created_date: new Date().toISOString(),
    };

    localStorage.setItem("mockAccounts", JSON.stringify(allAccounts));
    return { success: true, account };
  },

  whoami: async (token: string) => {
    if (!token) return null;
    return {
      username: "mock.user",
      role: "RESELLER_ADMIN",
      account_sid: "AC_RESELLER_1001",
    };
  },
};