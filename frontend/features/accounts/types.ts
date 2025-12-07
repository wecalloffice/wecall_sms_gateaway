// Reseller account type
export interface Reseller {
  account_sid: string;
  business_username: string;
  name: string;
  type: "reseller" | "platform";
  status: "active" | "suspended" | "inactive";
  billing?: {
    wallets: any[];
    transactions: any[];
  };
  sms_usage?: {
    total_sent: number;
    total_delivered: number;
    total_failed: number;
  };
  clients?: Client[];
  created_at?: string;
  updated_at?: string;
}

// Client account type (belongs to a reseller)
export interface Client {
  account_sid: string;
  business_username: string;
  name: string;
  type: "client" | "reseller";
  status: "active" | "suspended" | "inactive";
  parent_reseller_sid?: string;
  staff?: StaffMember[];
  billing?: {
    wallets: any[];
    transactions: any[];
  };
  sms_usage?: {
    total_sent: number;
    total_delivered: number;
    total_failed: number;
  };
  created_at?: string;
  updated_at?: string;
}

// Staff member type
export interface StaffMember {
  sid: string;
  business_sid: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  created_at?: string;
}

// Generic account (deprecated, use Reseller or Client)
export interface Account {
  id: string;
  name: string;
}
