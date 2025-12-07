import { mockObservability } from "@/mocks/adapters/mockObservability";
import type { AuditEvent, DLREvent } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_OBSERVABILITY !== "false";
const API_BASE = "/api/observability";

// ============================
//    Helper Functions
// ============================

async function apiGet(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
}

// ============================
//    EVENTS / LOGS
// ============================

/**
 * Get audit events with optional filtering
 */
export async function getEvents(
  business_sid?: string,
  filters?: {
    event_type?: string;
    actor?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }
): Promise<(AuditEvent | DLREvent)[]> {
  if (USE_MOCK) {
    return mockObservability.events();
  }

  const params = new URLSearchParams();
  if (business_sid) params.append("business_sid", business_sid);
  if (filters?.event_type) params.append("event_type", filters.event_type);
  if (filters?.actor) params.append("actor", filters.actor);
  if (filters?.date_from) params.append("date_from", filters.date_from);
  if (filters?.date_to) params.append("date_to", filters.date_to);
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const url = `${API_BASE}/events/?${params.toString()}`;
  return apiGet(url);
}

/**
 * Get audit events specifically
 */
export async function getAuditEvents(business_sid?: string): Promise<AuditEvent[]> {
  if (USE_MOCK) {
    const events = await mockObservability.events();
    return events.filter((e) => "action" in e) as AuditEvent[];
  }

  const url = business_sid
    ? `${API_BASE}/audit-events/${business_sid}/`
    : `${API_BASE}/audit-events/`;
  return apiGet(url);
}

/**
 * Get DLR (Delivery Report) events
 */
export async function getDLREvents(business_sid?: string): Promise<DLREvent[]> {
  if (USE_MOCK) {
    const events = await mockObservability.events();
    return events.filter((e) => "delivery_status" in e) as DLREvent[];
  }

  const url = business_sid
    ? `${API_BASE}/dlr-events/${business_sid}/`
    : `${API_BASE}/dlr-events/`;
  return apiGet(url);
}

/**
 * Get SMS logs (alias for DLR events from SMS perspective)
 */
export async function getSmsLogs(business_sid: string) {
  if (USE_MOCK) {
    // Return SMS-specific events
    return mockObservability.events();
  }

  return apiGet(`${API_BASE}/sms-logs/${business_sid}/`);
}
