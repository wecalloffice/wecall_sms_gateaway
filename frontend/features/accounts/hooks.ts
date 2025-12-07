// Custom hooks for accounts/resellers/clients
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getResellers,
  getReseller,
  getClients,
  getClient,
  getAllClients,
} from "./api";
import type { Reseller, Client } from "./types";

// ============ RESELLERS ============

/**
 * Get all resellers (platform admin only)
 */
export function useResellers() {
  return useQuery({
    queryKey: ["resellers"],
    queryFn: () => getResellers(),
  });
}

/**
 * Get a specific reseller
 */
export function useReseller(reseller_sid: string | null) {
  return useQuery({
    queryKey: ["reseller", reseller_sid],
    queryFn: () => getReseller(reseller_sid!),
    enabled: !!reseller_sid,
  });
}

// ============ CLIENTS ============

/**
 * Get clients for a specific reseller
 */
export function useClients(reseller_sid: string | null) {
  return useQuery({
    queryKey: ["clients", reseller_sid],
    queryFn: () => getClients(reseller_sid!),
    enabled: !!reseller_sid,
  });
}

/**
 * Get a specific client
 */
export function useClient(reseller_sid: string | null, client_sid: string | null) {
  return useQuery({
    queryKey: ["client", reseller_sid, client_sid],
    queryFn: () => getClient(reseller_sid!, client_sid!),
    enabled: !!reseller_sid && !!client_sid,
  });
}

/**
 * Get all clients across all resellers (platform admin)
 */
export function useAllClients() {
  return useQuery({
    queryKey: ["all-clients"],
    queryFn: () => getAllClients(),
  });
}
