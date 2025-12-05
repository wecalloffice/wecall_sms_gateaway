// mocks/adapters/mockSms.ts
import { wecallMockData } from "../data/wecallMockData";
import { mockBilling } from "./mockBilling";

type SendSmsPayload = {
  business_sid: string;
  reseller_sid?: string;
  from?: string;
  to: string;
  message: string;
};

let msgCounter = 1;

// Very simple pricing example for mock:
// You can later improve this to use country/operator logic.
function getSmsPriceForDestination(to: string): number {
  // Rwanda numbers start with +250 in your example
  if (to.startsWith("+250")) {
    // Simple fixed price for the mock
    return 0.01;
  }

  // Default price
  return 0.015;
}

export const mockSms = {
  // 👉 List messages for a given business
  list: async (business_sid: string) =>
    wecallMockData.messages.filter((m) => m.business_sid === business_sid),

  // 👉 Send SMS AND charge wallet
  send: async (payload: SendSmsPayload) => {
    console.log("Mock SMS send request:", payload);

    const { business_sid, reseller_sid, from, to } = payload;

    // 1) Calculate price
    const price = getSmsPriceForDestination(to);

    // 2) Debit wallet (this will throw if insufficient balance)
    await mockBilling.debitForSms(business_sid, price, {
      to,
      from,
      reason: "SMS sent",
    });

    // 3) Create a mock message record for observability/history
    const sid = "SM" + String(msgCounter++).padStart(6, "0");

    wecallMockData.messages.push({
      sid,
      business_sid,
      reseller_sid: reseller_sid ?? null,
      direction: "outbound",
      from: from ?? "WE-CALL",
      to,
      status: "delivered", // always delivered in mock
      error_code: null,
      price,
      currency: "USD",
      gateway: "mock-gateway",
      created_at: new Date().toISOString(),
      delivered_at: new Date().toISOString(),
    });

    console.log("Mock SMS sent, charged:", {
      sid,
      business_sid,
      price,
    });

    return { sid, price };
  },
};
