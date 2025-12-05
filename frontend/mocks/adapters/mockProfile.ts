'use client';

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
    // Client profile
    const clientProfile: UserProfile = {
      sid: 'AC_CLIENT_001',
      business_name: 'Rwanda Development Board',
      business_username: 'rdb',
      email: 'admin@rdb.rw',
      phone: '+250712345678',
      country: 'Rwanda',
      business_type: 'CLIENT',
      account_status: 'active',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-12-04T14:22:00Z',
      contact_person: 'Alice Mukamana',
    };
    this.profiles.set('AC_CLIENT_001', clientProfile);

    // Reseller profile
    const resellerProfile: UserProfile = {
      sid: 'AC_RESELLER_1001',
      business_name: 'Acme Solutions Ltd',
      business_username: 'acmesolutions',
      email: 'admin@acmesolutions.rw',
      phone: '+250722987654',
      country: 'Rwanda',
      business_type: 'RESELLER',
      account_status: 'active',
      created_at: '2023-06-10T08:15:00Z',
      updated_at: '2024-12-04T14:22:00Z',
      contact_person: 'John Doe',
      company_size: '25-50',
      industry: 'Technology',
      tax_id: 'TAX-001234567',
      registration_number: 'REG-98765432',
    };
    this.profiles.set('AC_RESELLER_1001', resellerProfile);

    // Platform admin profile
    const platformProfile: UserProfile = {
      sid: 'AC_PLATFORM_001',
      business_name: 'WeCall SMS Platform',
      business_username: 'wecall_admin',
      email: 'admin@wecall.com',
      phone: '+250788123456',
      country: 'Rwanda',
      business_type: 'PLATFORM_ADMIN',
      account_status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-12-04T14:22:00Z',
      contact_person: 'System Administrator',
    };
    this.profiles.set('AC_PLATFORM_001', platformProfile);
  }

  async getProfile(sidOrRole: string): Promise<UserProfile> {
    // Map roles to test SIDs
    let sid = sidOrRole;
    if (sidOrRole === 'PLATFORM_ADMIN') sid = 'AC_PLATFORM_001';
    if (sidOrRole === 'RESELLER_ADMIN') sid = 'AC_RESELLER_1001';
    if (sidOrRole === 'CLIENT_ADMIN') sid = 'AC_CLIENT_001';

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
      return {
        total_sms_sent: 4328,
        total_cost: 145.92,
        account_balance: 320.50,
      };
    } else if (profile.business_type === 'RESELLER') {
      return {
        total_sms_sent: 125400,
        total_cost: 2156.80,
        account_balance: 5000.00,
        active_clients: 12,
        active_sub_resellers: 3,
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
