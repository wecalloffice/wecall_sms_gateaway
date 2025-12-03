export interface LoginPayload {
  business_username: string;
  email: string;
  password: string;
}

export interface RegisterPayload {
  business_username: string;
  business_name: string;
  business_type: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  password: string;
}
