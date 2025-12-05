// Branding types for the SMS gateway application

export interface BrandingInfo {
  sid: string;
  business_sid: string;
  logo_url?: string;
  primaryColor?: string;
  secondaryColor?: string;
  brand_color?: string;
  companyName?: string;
  company_name?: string;
  sender_id?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  sid: string;
  business_sid: string;
  name: string;
  business_name?: string;
  business_username?: string;
  email?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at?: string;
  updated_at?: string;
}
