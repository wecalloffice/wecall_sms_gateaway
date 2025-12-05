// stores/smsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  tags?: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  contactIds: string[];
  createdAt: string;
}

export interface SmsLog {
  sid: string;
  business_sid: string;
  reseller_sid: string;
  direction: "outbound" | "inbound";
  from: string;
  to: string;
  message: string;
  status: "delivered" | "failed" | "pending";
  error_code?: string | null;
  price?: number;
  currency?: string;
  gateway?: string;
  created_at: string;
  delivered_at?: string;
}

export interface SenderId {
  id: string;
  senderId: string;
  status: "active" | "pending" | "rejected";
}

interface SmsStore {
  // State
  contacts: Contact[];
  groups: Group[];
  smsLogs: SmsLog[];
  senderIds: SenderId[];
  balance: number;

  // Contact Actions
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => Contact;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  bulkAddContacts: (contacts: Omit<Contact, "id" | "createdAt">[]) => Contact[];
  getContactById: (id: string) => Contact | undefined;
  getContactsByIds: (ids: string[]) => Contact[];

  // Group Actions
  addGroup: (group: Omit<Group, "id" | "createdAt">) => Group;
  updateGroup: (id: string, data: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addContactsToGroup: (groupId: string, contactIds: string[]) => void;
  removeContactsFromGroup: (groupId: string, contactIds: string[]) => void;
  getGroupById: (id: string) => Group | undefined;

  // SMS Actions
  sendSms: (payload: {
    to: string | string[];
    message: string;
    senderId: string;
  }) => Promise<SmsLog>;
  getSmsLogs: () => SmsLog[];

  // Sender ID Actions
  addSenderId: (senderId: string) => SenderId;

  // Utility
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

// Initial data
const initialContacts: Contact[] = [
  {
    id: "c1",
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
    company: "Acme Corp",
    tags: ["client"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Jane Smith",
    phone: "+0987654321",
    email: "jane@example.com",
    company: "Tech Solutions",
    tags: ["partner"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "c3",
    name: "Bob Johnson",
    phone: "+1122334455",
    email: "bob@example.com",
    tags: ["lead"],
    createdAt: new Date().toISOString(),
  },
];

const initialGroups: Group[] = [
  {
    id: "g1",
    name: "Marketing Team",
    description: "Marketing and outreach contacts",
    contactIds: ["c1", "c2"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "g2",
    name: "Sales Team",
    description: "Sales representatives",
    contactIds: ["c2", "c3"],
    createdAt: new Date().toISOString(),
  },
];

const initialSmsLogs: SmsLog[] = [
  {
    sid: "SM001",
    business_sid: "BUS001",
    reseller_sid: "RES001",
    direction: "outbound",
    to: "+1234567890",
    from: "WeCall",
    message: "Welcome to our service!",
    status: "delivered",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    delivered_at: new Date(Date.now() - 3590000).toISOString(),
    gateway: "Twilio",
    price: 0.015,
    currency: "USD",
  },
];

// Create store with persistence
export const useSmsStore = create<SmsStore>()(
  persist(
    (set, get) => ({
      // Initial State
      contacts: initialContacts,
      groups: initialGroups,
      smsLogs: initialSmsLogs,
      senderIds: [
        { id: "sid1", senderId: "WeCall", status: "active" },
        { id: "sid2", senderId: "MyBrand", status: "pending" },
      ],
      balance: 150.75,

      // ============ CONTACT ACTIONS ============
      addContact: (contactData) => {
        const newContact: Contact = {
          ...contactData,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
        return newContact;
      },

      updateContact: (id, data) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...data } : contact
          ),
        }));
      },

      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
          groups: state.groups.map((group) => ({
            ...group,
            contactIds: group.contactIds.filter((cid) => cid !== id),
          })),
        }));
      },

      bulkAddContacts: (contactsData) => {
        const newContacts = contactsData.map((data, index) => ({
          ...data,
          id: `c${Date.now()}_${index}`,
          createdAt: new Date().toISOString(),
        }));
        set((state) => ({
          contacts: [...state.contacts, ...newContacts],
        }));
        return newContacts;
      },

      getContactById: (id) => {
        return get().contacts.find((c) => c.id === id);
      },

      getContactsByIds: (ids) => {
        return get().contacts.filter((c) => ids.includes(c.id));
      },

      // ============ GROUP ACTIONS ============
      addGroup: (groupData) => {
        const newGroup: Group = {
          ...groupData,
          id: `g${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
        }));
        return newGroup;
      },

      updateGroup: (id, data) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, ...data } : group
          ),
        }));
      },

      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        }));
      },

      addContactsToGroup: (groupId, contactIds) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  contactIds: [
                    ...new Set([...group.contactIds, ...contactIds]),
                  ],
                }
              : group
          ),
        }));
      },

      removeContactsFromGroup: (groupId, contactIds) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  contactIds: group.contactIds.filter(
                    (id) => !contactIds.includes(id)
                  ),
                }
              : group
          ),
        }));
      },

      getGroupById: (id) => {
        return get().groups.find((g) => g.id === id);
      },

      // ============ SMS ACTIONS ============
      sendSms: async (payload) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const recipients = Array.isArray(payload.to)
          ? payload.to
          : [payload.to];

        // Create SMS log entries for each recipient
        const logs = recipients.map((phone) => {
          const log: SmsLog = {
            sid: `SM${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            business_sid: "BUS001",
            reseller_sid: "RES001",
            direction: "outbound",
            from: payload.senderId,
            to: phone,
            message: payload.message,
            status: "delivered",
            created_at: new Date().toISOString(),
            delivered_at: new Date(Date.now() + 5000).toISOString(),
            gateway: "Mock Gateway",
            price: 0.015,
            currency: "USD",
          };
          return log;
        });

        set((state) => ({
          smsLogs: [...logs, ...state.smsLogs],
          balance: state.balance - logs.length * 0.015,
        }));

        return logs[0]; // Return first log
      },

      getSmsLogs: () => {
        return get().smsLogs;
      },

      // ============ SENDER ID ACTIONS ============
      addSenderId: (senderId) => {
        const newSenderId: SenderId = {
          id: `sid${Date.now()}`,
          senderId,
          status: "pending",
        };
        set((state) => ({
          senderIds: [...state.senderIds, newSenderId],
        }));
        return newSenderId;
      },

      // ============ UTILITY ACTIONS ============
      clearAllData: () => {
        set({
          contacts: [],
          groups: [],
          smsLogs: [],
          senderIds: [],
          balance: 0,
        });
      },

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            contacts: state.contacts,
            groups: state.groups,
            smsLogs: state.smsLogs,
            senderIds: state.senderIds,
            balance: state.balance,
          },
          null,
          2
        );
      },

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            contacts: data.contacts || [],
            groups: data.groups || [],
            smsLogs: data.smsLogs || [],
            senderIds: data.senderIds || [],
            balance: data.balance || 0,
          });
        } catch (error) {
          console.error("Failed to import data:", error);
        }
      },
    }),
    {
      name: "sms-storage", // localStorage key
      partialize: (state) => ({
        contacts: state.contacts,
        groups: state.groups,
        smsLogs: state.smsLogs,
        senderIds: state.senderIds,
        balance: state.balance,
      }),
    }
  )
);
