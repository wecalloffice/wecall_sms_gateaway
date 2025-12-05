import { wecallMockData } from "../data/wecallMockData";

// Generate unique SIDs
function generateSid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const mockAccounts = {
  // ===== USERS =====
  listUsers: async () => {
    const users: any[] = [];
    
    // Get all users from platform
    wecallMockData.resellers.forEach((reseller) => {
      users.push({
        sid: reseller.account_sid,
        name: reseller.name,
        username: reseller.business_username,
        email: `${reseller.business_username}@wecall.com`,
        role: "Reseller Admin",
        business: reseller.name,
        status: reseller.status,
        created_at: reseller.created_at,
      });
    });

    return users;
  },

  getUser: async (sid: string) => {
    const users = await mockAccounts.listUsers();
    return users.find((u) => u.sid === sid) || null;
  },

  createUser: async (data: any) => {
    const newUser = {
      sid: generateSid("USR"),
      ...data,
      status: "active",
      created_at: new Date().toISOString(),
    };
    // In real app, save to backend/database
    console.log("Created user:", newUser);
    return newUser;
  },

  updateUser: async (sid: string, data: any) => {
    console.log(`Updated user ${sid}:`, data);
    return {
      sid,
      ...data,
      updated_at: new Date().toISOString(),
    };
  },

  deleteUser: async (sid: string) => {
    console.log(`Deleted user ${sid}`);
    return { success: true, sid };
  },

  // ===== RESELLERS =====
  listResellers: async () => {
    return wecallMockData.resellers;
  },

  getReseller: async (sid: string) => {
    return wecallMockData.resellers.find((r) => r.account_sid === sid) || null;
  },

  createReseller: async (data: any) => {
    const newReseller = {
      account_sid: generateSid("RES"),
      ...data,
      status: "active",
      created_at: new Date().toISOString(),
      clients: [],
    };
    wecallMockData.resellers.push(newReseller);
    console.log("Created reseller:", newReseller);
    return newReseller;
  },

  updateReseller: async (sid: string, data: any) => {
    const reseller = wecallMockData.resellers.find((r) => r.account_sid === sid);
    if (reseller) {
      Object.assign(reseller, data, { updated_at: new Date().toISOString() });
      console.log("Updated reseller:", reseller);
      return reseller;
    }
    return null;
  },

  deleteReseller: async (sid: string) => {
    const index = wecallMockData.resellers.findIndex((r) => r.account_sid === sid);
    if (index > -1) {
      wecallMockData.resellers.splice(index, 1);
      console.log(`Deleted reseller ${sid}`);
      return { success: true, sid };
    }
    return { success: false };
  },

  // ===== CLIENTS =====
  listClients: async () => {
    const clients: any[] = [];
    wecallMockData.resellers.forEach((reseller) => {
      reseller.clients?.forEach((client) => {
        clients.push({
          ...client,
          sid: client.account_sid, // Add sid alias for compatibility
          reseller_name: reseller.name,
          reseller_sid: reseller.account_sid,
        });
      });
    });
    return clients;
  },

  getClient: async (sid: string) => {
    for (const reseller of wecallMockData.resellers) {
      const client = reseller.clients?.find((c) => c.account_sid === sid);
      if (client) {
        return {
          ...client,
          sid: client.account_sid,
          reseller_name: reseller.name,
          reseller_sid: reseller.account_sid,
        };
      }
    }
    return null;
  },

  createClient: async (data: any, resellerSid: string) => {
    const reseller = wecallMockData.resellers.find((r) => r.account_sid === resellerSid);
    if (!reseller) return null;

    const newClient = {
      account_sid: generateSid("CLI"),
      sid: undefined as any, // Will be set to account_sid
      ...data,
      parent_reseller_sid: resellerSid,
      status: "active",
      created_at: new Date().toISOString(),
      staff: [],
      billing: {
        wallet_balance: 0,
        credit_limit: data.credit_limit || 500,
        currency: "USD",
      },
    };
    newClient.sid = newClient.account_sid; // Set sid alias

    if (!reseller.clients) reseller.clients = [];
    reseller.clients.push(newClient);
    console.log("Created client:", newClient);
    return newClient;
  },

  updateClient: async (sid: string, data: any) => {
    for (const reseller of wecallMockData.resellers) {
      const client = reseller.clients?.find((c) => c.account_sid === sid);
      if (client) {
        Object.assign(client, data, { updated_at: new Date().toISOString() });
        console.log("Updated client:", client);
        return {
          ...client,
          sid: client.account_sid,
        };
      }
    }
    return null;
  },

  deleteClient: async (sid: string) => {
    for (const reseller of wecallMockData.resellers) {
      const index = reseller.clients?.findIndex((c) => c.account_sid === sid) ?? -1;
      if (index > -1 && reseller.clients) {
        reseller.clients.splice(index, 1);
        console.log(`Deleted client ${sid}`);
        return { success: true, sid };
      }
    }
    return { success: false };
  },

  getResellerBySid: async (sid: string) => {
    return wecallMockData.resellers.find((r) => r.account_sid === sid) || null;
  },

  listClientsForReseller: async (resellerSid: string) => {
    const r = wecallMockData.resellers.find((x) => x.account_sid === resellerSid);
    return r ? r.clients || [] : [];
  },

  getAccount: async (accountSid: string) => {
    if (wecallMockData.platform_account.account_sid === accountSid)
      return wecallMockData.platform_account;
    for (const r of wecallMockData.resellers) {
      if (r.account_sid === accountSid) return r;
      const client = (r.clients || []).find((c) => c.account_sid === accountSid);
      if (client) return client;
    }
    return null;
  },
};
<<<<<<< HEAD
=======


>>>>>>> 0d4d5bf2bbd4eff8d412ceb5964ee9a17dd1e197
