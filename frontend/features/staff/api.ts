import { mockStaff } from "@/mocks/adapters/mockStaff";
import type { StaffMember } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_STAFF !== "false";
const API_BASE = "/api/staff";

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
//    STAFF MEMBERS
// ============================

/**
 * Get all staff members for a business
 */
export async function getStaff(business_sid: string): Promise<StaffMember[]> {
  if (USE_MOCK) {
    return mockStaff.list(business_sid);
  }
  return apiGet(`${API_BASE}/${business_sid}/`);
}

/**
 * Get a specific staff member
 */
export async function getStaffMember(
  business_sid: string,
  staff_id: string
): Promise<StaffMember | null> {
  if (USE_MOCK) {
    const staff = await mockStaff.list(business_sid);
    return staff.find((s) => s.sid === staff_id) || null;
  }
  return apiGet(`${API_BASE}/${business_sid}/${staff_id}/`);
}

/**
 * Create a new staff member
 */
export async function createStaffMember(
  business_sid: string,
  data: Partial<StaffMember>
) {
  if (USE_MOCK) {
    return {
      success: true,
      data: {
        sid: `ST${Date.now()}`,
        business_sid,
        ...data,
      },
    };
  }
  return apiPost(`${API_BASE}/${business_sid}/`, data);
}

/**
 * Update a staff member
 */
export async function updateStaffMember(
  business_sid: string,
  staff_id: string,
  data: Partial<StaffMember>
) {
  if (USE_MOCK) {
    return { success: true, data };
  }
  return apiPut(`${API_BASE}/${business_sid}/${staff_id}/`, data);
}

/**
 * Delete a staff member
 */
export async function deleteStaffMember(business_sid: string, staff_id: string) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiDelete(`${API_BASE}/${business_sid}/${staff_id}/`);
}

/**
 * Assign role to staff member
 */
export async function assignRole(
  business_sid: string,
  staff_id: string,
  role: string
) {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiPost(`${API_BASE}/${business_sid}/${staff_id}/assign-role/`, {
    role,
  });
}
