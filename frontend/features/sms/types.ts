export type SmsMessage = {
  sid: string;
  business_sid: string;
  reseller_sid: string;
  direction: "outbound" | "inbound";
  from: string;
  to: string;
  status: "delivered" | "failed" | "pending";
  error_code?: string | null;
  price?: number;
  currency?: string;
  gateway?: string;
  created_at: string;
  delivered_at?: string;
};

export type SmsPayload = {
  to: string; // comma-separated for group SMS
  message: string;
  senderId: string;
  business_sid: string;
};
