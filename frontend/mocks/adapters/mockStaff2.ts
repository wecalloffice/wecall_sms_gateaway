export const mockStaff = {
  listForAccount: async (business_sid: string) => {
    // Return mock staff
    return [
      { id: '1', name: 'Manager', email: 'manager@example.com', role: 'manager', account_sid: business_sid },
    ];
  },
  get: async (id: string) => {
    return { id, name: 'Staff Member', email: 'staff@example.com', role: 'agent' };
  },
};
