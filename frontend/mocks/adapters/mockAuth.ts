import { wecallMockData } from "../data/wecallMockData";

export const mockAuth = {
  login: async ({ business_username, email, password }) => {
    return {
      access: "mock-access-token",
      refresh: "mock-refresh-token",
      user: {
        email,
        business_username,
        role: "CLIENT_ADMIN",
      },
    };
  },

  register: async (payload) => {
    console.log("Mock registration:", payload);
    return { success: true };
  },
<<<<<<< HEAD
};
=======

}
>>>>>>> 0d4d5bf2bbd4eff8d412ceb5964ee9a17dd1e197
