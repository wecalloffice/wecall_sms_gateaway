'use client';

import { BRANDING_DEFAULTS } from '@/lib/constants/branding';

interface BrandingConfig {
  client_sid: string;
  reseller_sid: string;
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  created_at: string;
  updated_at: string;
}

class MockBrandingAdapter {
  private brandingConfigs: Map<string, BrandingConfig> = new Map();

  constructor() {
    // Initialize with default branding for demo clients
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Default branding for demo client
    const defaultBranding: BrandingConfig = {
      client_sid: 'AC_CLIENT_001',
      reseller_sid: 'AC_RESELLER_1001',
      companyName: 'Rwanda Development Board',
      logoUrl: '/logo.png',
      primaryColor: BRANDING_DEFAULTS.primaryColor,
      secondaryColor: BRANDING_DEFAULTS.secondaryColor,
      accentColor: BRANDING_DEFAULTS.accentColor,
      supportEmail: 'support@rdb.rw',
      supportPhone: '+250712345678',
      websiteUrl: 'https://rdb.rw',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.brandingConfigs.set('AC_CLIENT_001', defaultBranding);
  }

  // Get branding config for a specific client
  async getBrandingConfig(clientSid: string): Promise<BrandingConfig> {
    return (
      this.brandingConfigs.get(clientSid) || {
        client_sid: clientSid,
        reseller_sid: 'AC_RESELLER_1001',
        companyName: BRANDING_DEFAULTS.companyName,
        logoUrl: BRANDING_DEFAULTS.logoUrl,
        primaryColor: BRANDING_DEFAULTS.primaryColor,
        secondaryColor: BRANDING_DEFAULTS.secondaryColor,
        accentColor: BRANDING_DEFAULTS.accentColor,
        supportEmail: 'support@example.com',
        supportPhone: '+250700000000',
        websiteUrl: 'https://example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );
  }

  // Get branding configs for all clients of a reseller
  async getResellerClientsBranding(resellerSid: string): Promise<BrandingConfig[]> {
    return Array.from(this.brandingConfigs.values()).filter(
      (config) => config.reseller_sid === resellerSid
    );
  }

  // Update branding config
  async updateBrandingConfig(
    clientSid: string,
    updates: Partial<BrandingConfig>
  ): Promise<BrandingConfig> {
    const existing = await this.getBrandingConfig(clientSid);
    const updated: BrandingConfig = {
      ...existing,
      ...updates,
      client_sid: clientSid,
      updated_at: new Date().toISOString(),
    };
    this.brandingConfigs.set(clientSid, updated);
    return updated;
  }

  // Apply branding to localStorage
  async applyBranding(clientSid: string): Promise<void> {
    const branding = await this.getBrandingConfig(clientSid);
    localStorage.setItem(`branding_${clientSid}`, JSON.stringify(branding));
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', branding.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', branding.accentColor);
  }

  // Get applied branding from localStorage
  getAppliedBranding(clientSid: string): BrandingConfig | null {
    const stored = localStorage.getItem(`branding_${clientSid}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Clear branding from localStorage
  clearBranding(clientSid: string): void {
    localStorage.removeItem(`branding_${clientSid}`);
  }

  // Get all branding configs (admin function)
  async getAllBrandingConfigs(): Promise<BrandingConfig[]> {
    return Array.from(this.brandingConfigs.values());
  }
}

export const mockBranding = new MockBrandingAdapter();
