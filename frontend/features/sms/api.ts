import { mockSms } from "@/mocks/adapters/mockSms";
import type { SmsMessage, SmsPayload } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_SMS !== "false";
const API_BASE = "/api/sms";

// ============================
//    Helper Functions
// ============================

async function apiGet(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
}

async function apiPost(url: string, data: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST failed: ${url}`);
  return res.json();
}

async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE failed: ${url}`);
  return res.json();
}

// ============================
//    SMS MESSAGES
// ============================

export async function listSms(business_sid: string) {
  if (USE_MOCK) {
    return mockSms.list(business_sid);
  }
  return apiGet(`${API_BASE}/logs/${business_sid}/`);
}

export async function sendSms(payload: SmsPayload): Promise<{ sid: string }> {
  if (USE_MOCK) {
    return mockSms.send(payload);
  }
  return apiPost(`${API_BASE}/send/`, payload);
}

// ============================
//    CONTACTS
// ============================

export async function fetchContacts(business_sid: string) {
  if (USE_MOCK) {
    // Return mock contacts (could filter by business_sid if needed)
    return [
      { id: "1", name: "John Doe", phone: "+1234567890", business_sid },
      { id: "2", name: "Jane Smith", phone: "+0987654321", business_sid },
      { id: "3", name: "Bob Johnson", phone: "+1122334455", business_sid },
    ];
  }
  return apiGet(`${API_BASE}/contacts/${business_sid}/`);
}

export async function addContact(business_sid: string, data: any) {
  if (USE_MOCK) {
    const newContact = {
      id: `c${Date.now()}`,
      business_sid,
      ...data,
    };
    return { success: true, data: newContact };
  }
  return apiPost(`${API_BASE}/contacts/${business_sid}/`, data);
}

export async function updateContact(business_sid: string, id: string, data: any) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiPost(`${API_BASE}/contacts/${business_sid}/${id}/`, data);
}

export async function deleteContact(business_sid: string, id: string) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiDelete(`${API_BASE}/contacts/${business_sid}/${id}/`);
}

// ============================
//    GROUPS
// ============================

export async function fetchGroups(business_sid: string) {
  if (USE_MOCK) {
    return [
      { id: "g1", name: "Marketing Team", contactCount: 25, business_sid },
      { id: "g2", name: "Sales Team", contactCount: 15, business_sid },
      { id: "g3", name: "Support Team", contactCount: 10, business_sid },
    ];
  }
  return apiGet(`${API_BASE}/groups/${business_sid}/`);
}

export async function addGroup(business_sid: string, data: any) {
  if (USE_MOCK) {
    const newGroup = {
      id: `g${Date.now()}`,
      business_sid,
      name: data.name,
      contactCount: data.contactIds?.length || 0,
      contactIds: data.contactIds || [],
    };
    return { success: true, data: newGroup };
  }
  return apiPost(`${API_BASE}/groups/${business_sid}/`, data);
}

export async function updateGroup(business_sid: string, id: string, data: any) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiPost(`${API_BASE}/groups/${business_sid}/${id}/`, data);
}

export async function deleteGroup(business_sid: string, id: string) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiDelete(`${API_BASE}/groups/${business_sid}/${id}/`);
}

// ============================
//    SENDER IDS
// ============================

export async function fetchSenderIds(business_sid: string) {
  if (USE_MOCK) {
    return [
      { id: "sid1", senderId: "WeCall", status: "active", business_sid },
      { id: "sid2", senderId: "MyBrand", status: "pending", business_sid },
      { id: "sid3", senderId: "Support", status: "active", business_sid },
    ];
  }
  return apiGet(`${API_BASE}/sender-ids/${business_sid}/`);
}

// ============================
//    WALLET/BALANCE
// ============================

export async function fetchBalance(business_sid: string) {
  if (USE_MOCK) {
    return { balance: 150.75, currency: "USD", business_sid };
  }
  return apiGet(`/api/wallet/balance/${business_sid}/`);
}
