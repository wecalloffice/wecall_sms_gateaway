// Branding configuration constants
export const BRANDING_DEFAULTS = {
  companyName: 'WeCall SMS',
  logoUrl: '/logo.png',
  primaryColor: '#e91e63',
  secondaryColor: '#2196f3',
  accentColor: '#ff9800',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  backgroundColor: '#f5f5f5',
  borderColor: '#e0e0e0',
};

export const COLOR_PRESETS = [
  { name: 'Pink', primary: '#e91e63', secondary: '#f48fb1' },
  { name: 'Blue', primary: '#2196f3', secondary: '#64b5f6' },
  { name: 'Purple', primary: '#9c27b0', secondary: '#ce93d8' },
  { name: 'Red', primary: '#f44336', secondary: '#ef9a9a' },
  { name: 'Green', primary: '#4caf50', secondary: '#a5d6a7' },
  { name: 'Orange', primary: '#ff9800', secondary: '#ffb74d' },
  { name: 'Teal', primary: '#009688', secondary: '#80cbc4' },
  { name: 'Indigo', primary: '#3f51b5', secondary: '#9fa8da' },
];

export const BRANDING_FIELDS = {
  companyName: {
    label: 'Company/Brand Name',
    placeholder: 'e.g., Your Company Name',
    type: 'text',
  },
  logoUrl: {
    label: 'Logo URL',
    placeholder: 'https://example.com/logo.png',
    type: 'url',
  },
  primaryColor: {
    label: 'Primary Color',
    type: 'color',
  },
  secondaryColor: {
    label: 'Secondary Color',
    type: 'color',
  },
  accentColor: {
    label: 'Accent Color',
    type: 'color',
  },
  supportEmail: {
    label: 'Support Email',
    placeholder: 'support@company.com',
    type: 'email',
  },
  supportPhone: {
    label: 'Support Phone',
    placeholder: '+250712345678',
    type: 'tel',
  },
  websiteUrl: {
    label: 'Website URL',
    placeholder: 'https://company.com',
    type: 'url',
  },
};
