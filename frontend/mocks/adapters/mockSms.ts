<<<<<<< HEAD
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
=======
import { wecallMockData } from "../data/wecallMockData";

// Running in-memory message store (starts with seeded messages)
const messages: any[] = [...wecallMockData.messages];

// Simulate delivery status updates
const simulateDelivery = (message: any) => {
  const statuses = ['sent', 'delivered', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  message.status = randomStatus;
  if (randomStatus === 'delivered') {
    message.dlr_received_at = new Date(Date.now() + Math.random() * 5000).toISOString();
  }
};

export const mockSms = {
  list: async (filter?: any) => {
    if (!filter) return messages;
    return messages.filter((m) => {
      if (filter.business_sid && m.business_sid !== filter.business_sid) return false;
      if (filter.reseller_sid && m.reseller_sid !== filter.reseller_sid) return false;
      if (filter.status && m.status !== filter.status) return false;
      return true;
    });
  },

  send: async (payload: any) => {
    const sid = "SM" + String(1000 + messages.length + 1).padStart(4, "0");
    const now = new Date().toISOString();
    const msg = {
      sid,
      business_sid: payload.business_sid,
      reseller_sid: payload.reseller_sid,
      direction: "outbound",
      from: payload.from,
      to: payload.to,
      message: payload.message,
      status: "queued",
      price: payload.price || 0.018,
      currency: payload.currency || "USD",
      gateway: payload.gateway || "jasmin-primary",
      created_at: now,
      sms_parts: Math.ceil(payload.message.length / 160),
    };
    messages.unshift(msg);
    
    // Simulate delivery after 1-3 seconds
    setTimeout(() => simulateDelivery(msg), 1000 + Math.random() * 2000);
    
    return msg;
  },

  sendBulk: async (payload: any) => {
    const recipients = payload.to.split(',').map((r: string) => r.trim()).filter((r: string) => r);
    const sentMessages = [];
    
    for (const to of recipients) {
      const msg = await mockSms.send({
        ...payload,
        to,
      });
      sentMessages.push(msg);
    }
    
    return {
      total: recipients.length,
      messages: sentMessages,
      timestamp: new Date().toISOString(),
    };
  },

  getStats: async (businessSid?: string) => {
    const filtered = businessSid 
      ? messages.filter(m => m.business_sid === businessSid)
      : messages;
    
    return {
      total: filtered.length,
      sent: filtered.filter(m => m.status === 'sent').length,
      delivered: filtered.filter(m => m.status === 'delivered').length,
      failed: filtered.filter(m => m.status === 'failed').length,
      queued: filtered.filter(m => m.status === 'queued').length,
      total_cost: filtered.reduce((sum, m) => sum + (m.price || 0), 0),
    };
  },

  getMessage: async (sid: string) => {
    return messages.find(m => m.sid === sid) || null;
  },

  updateStatus: async (sid: string, status: string) => {
    const msg = messages.find(m => m.sid === sid);
    if (msg) {
      msg.status = status;
      if (status === 'delivered') {
        msg.dlr_received_at = new Date().toISOString();
      }
    }
    return msg;
  },
};
