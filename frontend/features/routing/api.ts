import { mockRouting } from "@/mocks/adapters/mockRouting";
import type { Connector, Route } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_ROUTING !== "false";
const API_BASE = "/api/routing";

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

async function apiPut(url: string, data: any) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT failed: ${url}`);
  return res.json();
}

async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE failed: ${url}`);
  return res.json();
}

// ============================
//    CONNECTORS
// ============================

/**
 * Get all SMS gateways/connectors
 */
export async function getConnectors(): Promise<Connector[]> {
  if (USE_MOCK) {
    return mockRouting.connectors();
  }
  return apiGet(`${API_BASE}/connectors/`);
}

/**
 * Get connector details
 */
export async function getConnector(connector_id: string): Promise<Connector | null> {
  if (USE_MOCK) {
    const connectors = await mockRouting.connectors();
    return connectors.find((c) => c.sid === connector_id) || null;
  }
  return apiGet(`${API_BASE}/connectors/${connector_id}/`);
}

/**
 * Create a new connector
 */
export async function createConnector(data: Partial<Connector>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPost(`${API_BASE}/connectors/`, data);
}

/**
 * Update a connector
 */
export async function updateConnector(connector_id: string, data: Partial<Connector>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPut(`${API_BASE}/connectors/${connector_id}/`, data);
}

/**
 * Delete a connector
 */
export async function deleteConnector(connector_id: string) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiDelete(`${API_BASE}/connectors/${connector_id}/`);
}

// ============================
//    ROUTES
// ============================

/**
 * Get all routes for a business
 */
export async function getRoutes(business_sid: string): Promise<Route[]> {
  if (USE_MOCK) {
    return mockRouting.routes();
  }
  return apiGet(`${API_BASE}/routes/${business_sid}/`);
}

/**
 * Get route details
 */
export async function getRoute(business_sid: string, route_id: string): Promise<Route | null> {
  if (USE_MOCK) {
    const routes = await mockRouting.routes();
    return routes.find((r) => r.sid === route_id) || null;
  }
  return apiGet(`${API_BASE}/routes/${business_sid}/${route_id}/`);
}

/**
 * Create a new route
 */
export async function createRoute(business_sid: string, data: Partial<Route>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPost(`${API_BASE}/routes/${business_sid}/`, data);
}

/**
 * Update a route
 */
export async function updateRoute(business_sid: string, route_id: string, data: Partial<Route>) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPut(`${API_BASE}/routes/${business_sid}/${route_id}/`, data);
}

/**
 * Delete a route
 */
export async function deleteRoute(business_sid: string, route_id: string) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiDelete(`${API_BASE}/routes/${business_sid}/${route_id}/`);
}
