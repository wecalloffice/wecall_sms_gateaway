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

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  sendSms,
  fetchSmsLogs,
  fetchContacts,
  fetchGroups,
  fetchSenderIds,
  fetchBalance,
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
