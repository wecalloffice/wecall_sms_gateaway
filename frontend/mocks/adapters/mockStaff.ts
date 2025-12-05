import { wecallMockData } from "../data/wecallMockData";

export const mockStaff = {
  list: async (business_sid: string) => {
    // Return mock staff data
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'manager' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'agent' },
    ];
  },
};