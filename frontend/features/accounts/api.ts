import { mockAccounts } from "@/mocks/adapters/mockAccounts";
import type { Reseller, Client } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_ACCOUNTS !== "false";
const API_BASE = "/api/accounts";

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

// ============================
//    RESELLERS
// ============================

/**
 * Get all resellers (platform admin only)
 */
export async function getResellers(): Promise<Reseller[]> {
  if (USE_MOCK) {
    return mockAccounts.getResellers();
  }
  return apiGet(`${API_BASE}/resellers/`);
}

/**
 * Get reseller details
 */
export async function getReseller(reseller_sid: string): Promise<Reseller | null> {
  if (USE_MOCK) {
    const resellers = await mockAccounts.getResellers();
    return resellers.find((r) => r.account_sid === reseller_sid) || null;
  }
  return apiGet(`${API_BASE}/resellers/${reseller_sid}/`);
}

/**
 * Create a new reseller
 */
export async function createReseller(data: Partial<Reseller>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPost(`${API_BASE}/resellers/`, data);
}

// ============================
//    CLIENTS
// ============================

/**
 * Get clients for a reseller
 */
export async function getClients(reseller_sid: string): Promise<Client[]> {
  if (USE_MOCK) {
    return mockAccounts.getClients(reseller_sid);
  }
  return apiGet(`${API_BASE}/resellers/${reseller_sid}/clients/`);
}

/**
 * Get client details
 */
export async function getClient(reseller_sid: string, client_sid: string): Promise<Client | null> {
  if (USE_MOCK) {
    const clients = await mockAccounts.getClients(reseller_sid);
    return clients.find((c) => c.account_sid === client_sid) || null;
  }
  return apiGet(`${API_BASE}/resellers/${reseller_sid}/clients/${client_sid}/`);
}

/**
 * Create a new client under a reseller
 */
export async function createClient(reseller_sid: string, data: Partial<Client>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPost(`${API_BASE}/resellers/${reseller_sid}/clients/`, data);
}

/**
 * Update a client
 */
export async function updateClient(reseller_sid: string, client_sid: string, data: Partial<Client>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPost(`${API_BASE}/resellers/${reseller_sid}/clients/${client_sid}/`, data);
}

/**
 * Get all clients (platform admin, for dashboard view)
 */
export async function getAllClients(): Promise<Client[]> {
  if (USE_MOCK) {
    // Flatten all clients from all resellers
    const resellers = await mockAccounts.getResellers();
    let allClients: Client[] = [];
    for (const reseller of resellers) {
      const clients = await mockAccounts.getClients(reseller.account_sid);
      allClients = allClients.concat(clients);
    }
    return allClients;
  }
  return apiGet(`${API_BASE}/clients/`);
}
