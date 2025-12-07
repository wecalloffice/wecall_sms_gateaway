// Custom hooks for observability
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getEvents,
  getAuditEvents,
  getDLREvents,
  getSmsLogs,
} from "./api";

// ============ EVENTS ============

/**
 * Get all events with optional filtering
 */
export function useEvents(
  business_sid?: string,
  filters?: {
    event_type?: string;
    actor?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ["events", business_sid, filters],
    queryFn: () => getEvents(business_sid, filters),
  });
}

/**
 * Get audit events only
 */
export function useAuditEvents(business_sid?: string) {
  return useQuery({
    queryKey: ["audit-events", business_sid],
    queryFn: () => getAuditEvents(business_sid),
  });
}

/**
 * Get DLR (Delivery Report) events only
 */
export function useDLREvents(business_sid?: string) {
  return useQuery({
    queryKey: ["dlr-events", business_sid],
    queryFn: () => getDLREvents(business_sid),
  });
}

/**
 * Get SMS logs (alias for DLR events from SMS perspective)
 */
export function useSmsLogs(business_sid: string | null) {
  return useQuery({
    queryKey: ["sms-logs", business_sid],
    queryFn: () => getSmsLogs(business_sid!),
    enabled: !!business_sid,
  });
}
