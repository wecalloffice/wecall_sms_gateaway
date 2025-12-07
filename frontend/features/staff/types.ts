// Staff member type
export interface StaffMember {
  sid: string;
  business_sid: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  permissions?: string[];
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

// Generic staff (deprecated, use StaffMember)
export interface Staff {
  id: string;
  name: string;
  role: string;
}
