// Custom hooks for routing
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConnectors,
  getConnector,
  createConnector,
  updateConnector,
  deleteConnector,
  getRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute,
} from "./api";
import type { Connector, Route } from "./types";

// ============ CONNECTORS ============

/**
 * Get all connectors
 */
export function useConnectors() {
  return useQuery({
    queryKey: ["connectors"],
    queryFn: () => getConnectors(),
  });
}

/**
 * Get a specific connector
 */
export function useConnector(connector_id: string | null) {
  return useQuery({
    queryKey: ["connector", connector_id],
    queryFn: () => getConnector(connector_id!),
    enabled: !!connector_id,
  });
}

/**
 * Create a new connector
 */
export function useCreateConnector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Connector>) => createConnector(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connectors"] });
    },
  });
}

/**
 * Update a connector
 */
export function useUpdateConnector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ connector_id, data }: { connector_id: string; data: Partial<Connector> }) =>
      updateConnector(connector_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connectors"] });
    },
  });
}

/**
 * Delete a connector
 */
export function useDeleteConnector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connector_id: string) => deleteConnector(connector_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connectors"] });
    },
  });
}

// ============ ROUTES ============

/**
 * Get all routes for a business
 */
export function useRoutes(business_sid: string | null) {
  return useQuery({
    queryKey: ["routes", business_sid],
    queryFn: () => getRoutes(business_sid!),
    enabled: !!business_sid,
  });
}

/**
 * Get a specific route
 */
export function useRoute(business_sid: string | null, route_id: string | null) {
  return useQuery({
    queryKey: ["route", business_sid, route_id],
    queryFn: () => getRoute(business_sid!, route_id!),
    enabled: !!business_sid && !!route_id,
  });
}

/**
 * Create a new route
 */
export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      data,
    }: {
      business_sid: string;
      data: Partial<Route>;
    }) => createRoute(business_sid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

/**
 * Update a route
 */
export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      route_id,
      data,
    }: {
      business_sid: string;
      route_id: string;
      data: Partial<Route>;
    }) => updateRoute(business_sid, route_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

/**
 * Delete a route
 */
export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      route_id,
    }: {
      business_sid: string;
      route_id: string;
    }) => deleteRoute(business_sid, route_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}
