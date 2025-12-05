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
