import { wecallMockData } from "../data/wecallMockData";

export const mockSms = {
  list: async (business_sid) =>
    wecallMockData.messages.filter((m) => m.business_sid === business_sid),

  send: async (payload) => {
    console.log("Mock SMS sent:", payload);
    return { sid: "SM" + Math.floor(Math.random() * 999999) };
  },
};
