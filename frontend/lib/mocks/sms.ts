// lib/mocks/sms.ts - Mock data for SMS feature

export const mockSmsLogs = [
  {
    sid: "SM001",
    business_sid: "BUS001",
    reseller_sid: "RES001",
    direction: "outbound" as const,
    to: "+1234567890",
    from: "WeCall",
    message: "Test message 1",
    status: "delivered" as const,
    created_at: "2025-12-03T10:30:00Z",
    delivered_at: "2025-12-03T10:30:15Z",
    gateway: "Twilio",
    price: 0.015,
    currency: "USD",
  },
  {
    sid: "SM002",
    business_sid: "BUS001",
    reseller_sid: "RES001",
    direction: "outbound" as const,
    to: "+0987654321",
    from: "WeCall",
    message: "Test message 2",
    status: "pending" as const,
    created_at: "2025-12-03T09:15:00Z",
    gateway: "Vonage",
    price: 0.012,
    currency: "USD",
  },
  {
    sid: "SM003",
    business_sid: "BUS001",
    reseller_sid: "RES001",
    direction: "outbound" as const,
    to: "+1122334455",
    from: "WeCall",
    message: "Test message 3",
    status: "failed" as const,
    created_at: "2025-12-03T08:00:00Z",
    gateway: "Twilio",
    price: 0.015,
    currency: "USD",
    error_code: "INVALID_NUMBER",
  },
];

export const mockContacts = [
  { id: "1", name: "John Doe", phone: "+1234567890" },
  { id: "2", name: "Jane Smith", phone: "+0987654321" },
  { id: "3", name: "Bob Johnson", phone: "+1122334455" },
];

export const mockGroups = [
  { id: "g1", name: "Marketing Team", contactCount: 25 },
  { id: "g2", name: "Sales Team", contactCount: 15 },
  { id: "g3", name: "Support Team", contactCount: 10 },
];

export const mockSenderIds = [
  { id: "sid1", senderId: "WeCall", status: "active" },
  { id: "sid2", senderId: "MyBrand", status: "pending" },
  { id: "sid3", senderId: "Support", status: "active" },
];

export const mockBalance = {
  balance: 150.75,
  currency: "USD",
};

// Mock send SMS function
export const mockSendSms = async (payload: any) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    success: true,
    sid: `SM${Date.now()}`,
    message: "SMS sent successfully",
    ...payload,
  };
};

// ============ CONTACT MUTATIONS ============
export const mockAddContact = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newContact = {
    id: `c${Date.now()}`,
    ...data,
  };
  mockContacts.push(newContact);
  return { success: true, data: newContact };
};

export const mockUpdateContact = async (id: string, data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockContacts.findIndex(c => c.id === id);
  if (index !== -1) {
    mockContacts[index] = { ...mockContacts[index], ...data };
  }
  return { success: true };
};

export const mockDeleteContact = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockContacts.findIndex(c => c.id === id);
  if (index !== -1) {
    mockContacts.splice(index, 1);
  }
  return { success: true };
};

// ============ GROUP MUTATIONS ============
export const mockAddGroup = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newGroup = {
    id: `g${Date.now()}`,
    name: data.name,
    contactCount: data.contactIds?.length || 0,
    contactIds: data.contactIds || [],
  };
  mockGroups.push(newGroup);
  return { success: true, data: newGroup };
};

export const mockUpdateGroup = async (id: string, data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockGroups.findIndex(g => g.id === id);
  if (index !== -1) {
    mockGroups[index] = { 
      ...mockGroups[index], 
      ...data,
      contactCount: data.contactIds?.length || mockGroups[index].contactCount
    };
  }
  return { success: true };
};

export const mockDeleteGroup = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockGroups.findIndex(g => g.id === id);
  if (index !== -1) {
    mockGroups.splice(index, 1);
  }
  return { success: true };
};
