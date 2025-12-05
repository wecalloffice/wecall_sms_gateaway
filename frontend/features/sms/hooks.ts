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
  sendSms,
  fetchSmsLogs,
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

// SEND SMS
export function useSendSms() {
  return useMutation({
    mutationFn: (payload: SmsPayload) => sendSms(payload),
  });
}

// SMS LOGS
export function useSmsLogs() {
  return useQuery({
    queryKey: ["sms-logs"],
    queryFn: fetchSmsLogs,
  });
}

// CONTACTS
export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });
}

// GROUPS
export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });
}

// SENDER IDs
export function useSenderIds() {
  return useQuery({
    queryKey: ["senderIds"],
    queryFn: fetchSenderIds,
  });
}

// WALLET BALANCE
export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
  });
}

// ============ CONTACT MUTATIONS ============
export function useAddContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

// ============ GROUP MUTATIONS ============
export function useAddGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
