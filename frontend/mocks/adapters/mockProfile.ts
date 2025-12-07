'use client';

import { wecallMockData } from '../data/wecallMockData';

interface UserProfile {
  sid: string;
  business_name: string;
  business_username: string;
  email: string;
  phone: string;
  country: string;
  business_type: string;
  account_status: string;
  created_at: string;
  updated_at: string;
  contact_person?: string;
  company_size?: string;
  industry?: string;
  tax_id?: string;
  registration_number?: string;
}

interface AccountStats {
  total_sms_sent: number;
  total_cost: number;
  account_balance: number;
  active_clients?: number;
  active_sub_resellers?: number;
}

class MockProfileAdapter {
  private profiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeProfiles();
  }

  private initializeProfiles() {
    const now = new Date().toISOString();

    // Platform account
    const platform = wecallMockData.platform_account;
    this.profiles.set(platform.account_sid, {
      sid: platform.account_sid,
      business_name: platform.name,
      business_username: platform.name.toLowerCase().replace(/\s+/g, '_'),
      email: 'admin@wecall.test',
      phone: '+250788000000',
      country: platform.country,
      business_type: platform.type,
      account_status: platform.status,
      created_at: now,
      updated_at: now,
      contact_person: 'System Administrator',
    });

    // Resellers and their clients
    wecallMockData.resellers.forEach((reseller) => {
      this.profiles.set(reseller.account_sid, {
        sid: reseller.account_sid,
        business_name: reseller.name,
        business_username: reseller.business_username,
        email: `${reseller.business_username}@wecall.test`,
        phone: '+250700000000',
        country: 'Rwanda',
        business_type: reseller.type,
        account_status: reseller.status,
        created_at: reseller.created_at,
        updated_at: now,
        contact_person: `${reseller.name} Admin`,
      });

      reseller.clients.forEach((client) => {
        this.profiles.set(client.account_sid, {
          sid: client.account_sid,
          business_name: client.name,
          business_username: client.business_username,
          email: `${client.business_username}@${reseller.business_username}.test`,
          phone: '+250711111111',
          country: 'Rwanda',
          business_type: client.type,
          account_status: client.status,
          created_at: client.created_at,
          updated_at: now,
          contact_person: `${client.name} Admin`,
        });
      });
    });
  }

  async getProfile(sidOrRole: string): Promise<UserProfile> {
    // Map roles to test SIDs
    let sid = sidOrRole;
    if (sidOrRole === 'PLATFORM_ADMIN') sid = wecallMockData.platform_account.account_sid;
    if (sidOrRole === 'RESELLER_ADMIN') sid = wecallMockData.resellers[0]?.account_sid ?? sid;
    if (sidOrRole === 'CLIENT_ADMIN') sid = wecallMockData.resellers[0]?.clients[0]?.account_sid ?? sid;

    const profile = this.profiles.get(sid);
    if (!profile) {
      throw new Error(`Profile not found for ${sidOrRole}`);
    }
    return profile;
  }

  async getAccountStats(sid: string): Promise<AccountStats> {
    const profile = this.profiles.get(sid);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Return different stats based on account type
    if (profile.business_type === 'CLIENT') {
      const reseller = wecallMockData.resellers.find((r) =>
        r.clients.some((c) => c.account_sid === sid)
      );
      const client = reseller?.clients.find((c) => c.account_sid === sid);
      const wallet = wecallMockData.billing.wallets.find((w) => w.business_sid === sid);

      return {
        total_sms_sent: client?.sms_usage.this_month_outbound ?? 0,
        total_cost: (client?.sms_usage.this_month_outbound ?? 0) * 0.018,
        account_balance: wallet?.balance ?? client?.billing.wallet_balance ?? 0,
      };
    } else if (profile.business_type === 'RESELLER') {
      const reseller = wecallMockData.resellers.find((r) => r.account_sid === sid);
      const wallet = wecallMockData.billing.wallets.find((w) => w.business_sid === sid);

      return {
        total_sms_sent: reseller?.sms_usage.this_month_outbound ?? 0,
        total_cost: (reseller?.sms_usage.this_month_outbound ?? 0) * 0.018,
        account_balance: wallet?.balance ?? reseller?.billing.wallet_balance ?? 0,
        active_clients: reseller?.clients.length ?? 0,
        active_sub_resellers: 0,
      };
    } else {
      return {
        total_sms_sent: 8234500,
        total_cost: 145320.00,
        account_balance: 0,
        active_clients: 256,
        active_sub_resellers: 48,
      };
    }
  }

  async updateProfile(sid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.profiles.get(sid);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const updated: UserProfile = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.profiles.set(sid, updated);
    return updated;
  }

  async changePassword(sid: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // Mock implementation - in real system would verify old password
    return true;
  }

  async enable2FA(sid: string): Promise<{ secret: string; qrCode: string }> {
    return {
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/WeCall:user@example.com?secret=JBSWY3DPEHPK3PXP',
    };
  }

  async disable2FA(sid: string): Promise<boolean> {
    return true;
  }
}

export const mockProfile = new MockProfileAdapter();
