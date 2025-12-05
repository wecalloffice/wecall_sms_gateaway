// import { mockSms } from "@/mocks/adapters/mockSms";
// import { SmsPayload, SmsMessage } from "./types";

// // Fetch SMS logs
// export const listSms = async (business_sid: string): Promise<SmsMessage[]> => {
//   return await mockSms.list(business_sid);
// };

// // Send SMS
// export const sendSms = async (payload: SmsPayload) => {
//   return await mockSms.send(payload);
// };

// features/sms/api.ts
import { USE_MOCK } from "@/lib/env";
import {
  mockSendSms,
  mockSmsLogs,
  mockContacts,
  mockGroups,
  mockSenderIds,
  mockBalance,
  mockAddContact,
  mockDeleteContact,
  mockUpdateContact,
  mockAddGroup,
  mockDeleteGroup,
  mockUpdateGroup,
} from "@/lib/mocks/sms";

// ============================
//    REAL BACKEND APIs
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

// ============================
//        EXPORT API
// ============================

// SEND SMS
export const sendSms = (payload: any) =>
  USE_MOCK ? mockSendSms(payload) : apiPost("/api/sms/send", payload);

// SMS LOGS
export const fetchSmsLogs = () =>
  USE_MOCK ? Promise.resolve(mockSmsLogs) : apiGet("/api/sms/logs");

// CONTACTS
export const fetchContacts = () =>
  USE_MOCK ? Promise.resolve(mockContacts) : apiGet("/api/sms/contacts");

// GROUPS
export const fetchGroups = () =>
  USE_MOCK ? Promise.resolve(mockGroups) : apiGet("/api/sms/groups");

// SENDER IDs
export const fetchSenderIds = () =>
  USE_MOCK ? Promise.resolve(mockSenderIds) : apiGet("/api/sms/sender-ids");

// BALANCE
export const fetchBalance = () =>
  USE_MOCK ? Promise.resolve(mockBalance) : apiGet("/api/wallet/balance");

// CONTACT MANAGEMENT
export const addContact = (data: any) =>
  USE_MOCK ? mockAddContact(data) : apiPost("/api/sms/contacts", data);

export const updateContact = (id: string, data: any) =>
  USE_MOCK ? mockUpdateContact(id, data) : apiPost(`/api/sms/contacts/${id}`, data);

export const deleteContact = (id: string) =>
  USE_MOCK ? mockDeleteContact(id) : apiPost(`/api/sms/contacts/${id}/delete`, {});

// GROUP MANAGEMENT
export const addGroup = (data: any) =>
  USE_MOCK ? mockAddGroup(data) : apiPost("/api/sms/groups", data);

export const updateGroup = (id: string, data: any) =>
  USE_MOCK ? mockUpdateGroup(id, data) : apiPost(`/api/sms/groups/${id}`, data);

export const deleteGroup = (id: string) =>
  USE_MOCK ? mockDeleteGroup(id) : apiPost(`/api/sms/groups/${id}/delete`, {});
