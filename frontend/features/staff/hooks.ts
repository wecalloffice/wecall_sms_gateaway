// Custom hooks for staff
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaff,
  getStaffMember,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  assignRole,
} from "./api";
import type { StaffMember } from "./types";

// ============ STAFF MEMBERS ============

/**
 * Get all staff members for a business
 */
export function useStaff(business_sid: string | null) {
  return useQuery({
    queryKey: ["staff", business_sid],
    queryFn: () => getStaff(business_sid!),
    enabled: !!business_sid,
  });
}

/**
 * Get a specific staff member
 */
export function useStaffMember(business_sid: string | null, staff_id: string | null) {
  return useQuery({
    queryKey: ["staff-member", business_sid, staff_id],
    queryFn: () => getStaffMember(business_sid!, staff_id!),
    enabled: !!business_sid && !!staff_id,
  });
}

/**
 * Create a new staff member
 */
export function useCreateStaffMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      data,
    }: {
      business_sid: string;
      data: Partial<StaffMember>;
    }) => createStaffMember(business_sid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

/**
 * Update a staff member
 */
export function useUpdateStaffMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      staff_id,
      data,
    }: {
      business_sid: string;
      staff_id: string;
      data: Partial<StaffMember>;
    }) => updateStaffMember(business_sid, staff_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

/**
 * Delete a staff member
 */
export function useDeleteStaffMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      staff_id,
    }: {
      business_sid: string;
      staff_id: string;
    }) => deleteStaffMember(business_sid, staff_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

/**
 * Assign a role to a staff member
 */
export function useAssignRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      staff_id,
      role,
    }: {
      business_sid: string;
      staff_id: string;
      role: string;
    }) => assignRole(business_sid, staff_id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
