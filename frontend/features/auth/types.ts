// export interface LoginPayload {
//   business_username: string;
//   email: string;
//   password: string;
// }

// export interface RegisterPayload {
//   business_username: string;
//   business_name: string;
//   business_type: string;
//   contact_person: string;
//   contact_email: string;
//   contact_phone: string;
//   country: string;
//   password: string;
// }

export interface LoginPayload {
  // We use business_username in the UI,
  // but we will send it as "username" to the backend.
  business_username: string;
  password: string;
}

export interface RegisterPayload {
  business_username: string;
  business_name: string;
  business_type: string | null;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  password: string;
  password2: string;
}
