// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { listSms, sendSms } from "./api";
// import { SmsPayload, SmsMessage } from "./types";

// // Fetch SMS logs
// export const useSmsList = (business_sid: string) =>
//   useQuery<SmsMessage[]>(["smsList", business_sid], () => listSms(business_sid));

// // Send SMS
// export const useSendSms = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: sendSms,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["smsList"] }); // refresh logs after sending
//     },
//   });
// };



// features/sms/hooks.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listSms,
  sendSms,
  fetchContacts,
  fetchGroups,
  fetchSenderIds,
  fetchBalance,
  addContact,
  updateContact,
  deleteContact,
  addGroup,
  updateGroup,
  deleteGroup,
} from "./api";
import type { SmsPayload } from "./types";

// ============ SMS MESSAGES ============

export function useSmsLogs(business_sid: string) {
  return useQuery({
    queryKey: ["sms-logs", business_sid],
    queryFn: () => listSms(business_sid),
  });
}

// SEND SMS
export function useSendSms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SmsPayload) => sendSms(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-logs"] });
    },
  });
}

// ============ CONTACTS ============

export function useContacts(business_sid: string) {
  return useQuery({
    queryKey: ["contacts", business_sid],
    queryFn: () => fetchContacts(business_sid),
  });
}

export function useAddContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ business_sid, data }: { business_sid: string; data: any }) =>
      addContact(business_sid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      id,
      data,
    }: {
      business_sid: string;
      id: string;
      data: any;
    }) => updateContact(business_sid, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ business_sid, id }: { business_sid: string; id: string }) =>
      deleteContact(business_sid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

// ============ GROUPS ============

export function useGroups(business_sid: string) {
  return useQuery({
    queryKey: ["groups", business_sid],
    queryFn: () => fetchGroups(business_sid),
  });
}

export function useAddGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ business_sid, data }: { business_sid: string; data: any }) =>
      addGroup(business_sid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      business_sid,
      id,
      data,
    }: {
      business_sid: string;
      id: string;
      data: any;
    }) => updateGroup(business_sid, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ business_sid, id }: { business_sid: string; id: string }) =>
      deleteGroup(business_sid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// ============ SENDER IDs ============

export function useSenderIds(business_sid: string) {
  return useQuery({
    queryKey: ["sender-ids", business_sid],
    queryFn: () => fetchSenderIds(business_sid),
  });
}

// ============ WALLET BALANCE ============

export function useBalance(business_sid: string) {
  return useQuery({
    queryKey: ["balance", business_sid],
    queryFn: () => fetchBalance(business_sid),
  });
}
