# Advanced Registration System - User Journey & Architecture

## Account Hierarchy Structure

```
PLATFORM ADMIN (Top Level)
└── RESELLER (Primary Reseller)
    ├── SUB-RESELLER (Can manage their own clients)
    │   ├── CLIENT (Sub-reseller's client)
    │   ├── CLIENT (Sub-reseller's client)
    │   └── CLIENT (Sub-reseller's client)
    ├── CLIENT (Direct client of reseller)
    ├── CLIENT (Direct client of reseller)
    └── CLIENT → Can upgrade to SUB-RESELLER
```

---

## User Journey Maps

### 1. PUBLIC USER: Self-Register as CLIENT

```
┌─────────────────────────────────────────┐
│  Landing Page / Login Page              │
└─────────────────────────────────────────┘
           │
           ├─ Demo Account? → Login
           │
           └─ New Account? → Click [Create Account]
                    ↓
        ┌──────────────────────┐
        │  Registration Page   │
        │  /register           │
        └──────────────────────┘
           │
           ├─ Choose Account Type
           │  • CLIENT ✓ (selected)
           │  • RESELLER
           │
           └─ Fill Form
              • Username, Business Name
              • Contact Person, Email
              • Country (dropdown)
              • Phone (with prefix)
              • Password (confirm)
              │
              └─ Validate
                 ✓ No errors
                 │
                 └─ Create Account
                    Store in localStorage
                    │
                    └─ ✅ Success Message
                       └─ Auto-redirect to /login
                          │
                          └─ Login with new credentials
                             │
                             └─ Dashboard (CLIENT_ADMIN)
```

---

### 2. PUBLIC USER: Self-Register as RESELLER

```
┌─────────────────────────────────────────┐
│  Registration Page /register            │
└─────────────────────────────────────────┘
    │
    ├─ Choose Account Type
    │  • CLIENT
    │  • RESELLER ✓ (selected)
    │
    └─ Display Reseller Section (Blue Box)
       │
       ├─ BASIC INFO (Same as Client)
       │  • Username, Business Name
       │  • Contact Person, Email
       │  • Country, Phone
       │
       └─ RESELLER DETAILS
          • Account Type: BASIC/PROFESSIONAL/ENTERPRISE
          • Company Size: 1-10, 11-50, 51-200, ...
          • Industry: Marketing, Tech, Healthcare, ...
          • Tax ID (optional)
          • Company Registration (optional)
          │
          └─ Validate (All required fields)
             │
             └─ Create Account
                ├─ Set business_type = "RESELLER"
                ├─ Initialize reseller_details
                ├─ Initialize sub_clients = []
                │
                └─ ✅ Success
                   └─ Dashboard (RESELLER_ADMIN)
                      └─ Can now:
                         • Register sub-resellers
                         • Register clients
                         • Manage sub-accounts
```

---

### 3. RESELLER: Register Sub-Reseller

```
┌──────────────────────────────────┐
│  Reseller Dashboard              │
│  /reseller/dashboard             │
└──────────────────────────────────┘
    │
    └─ [+ Register Sub-Reseller] Button
       │
       └─ ResellerRegistrationModal Opens
          │
          ├─ Header: "Register Sub-Reseller"
          ├─ Subtitle: "Under your reseller account"
          │
          └─ Form (Quick-access version)
             • Username, Business Name
             • Contact Person, Email
             • Country, Phone
             • Password (confirm)
             │
             └─ Validation checks
                │
                └─ Submit
                   ├─ Create new account
                   ├─ Set business_type = "RESELLER"
                   ├─ Set parent_reseller = "current_user"
                   ├─ Initialize reseller_details
                   │
                   └─ ✅ Success Message
                      └─ New reseller can login
                         └─ Dashboard limited to parent's account
```

---

### 4. RESELLER: Register CLIENT

```
┌──────────────────────────────────┐
│  Reseller Dashboard              │
│  /reseller/dashboard             │
└──────────────────────────────────┘
    │
    └─ [+ Register Client] Button
       │
       └─ ClientRegistrationModal Opens
          │
          ├─ Header: "Register Client"
          ├─ Subtitle: "Add new client to your account"
          │
          └─ Form
             • Username, Business Name
             • Contact Person, Email
             • Country, Phone
             • Password (confirm)
             │
             └─ Validate
                │
                └─ Submit
                   ├─ Create new account
                   ├─ Set business_type = "CLIENT"
                   ├─ Set parent_reseller = "current_reseller"
                   │
                   └─ ✅ Success
                      └─ Client account ready
                         └─ Client can login
                            └─ Dashboard shows parent's SMS
```

---

### 5. CLIENT: Upgrade to RESELLER

```
┌──────────────────────────────────┐
│  Client Dashboard                │
│  /client/dashboard               │
└──────────────────────────────────┘
    │
    └─ [Settings] → [Upgrade to Reseller]
       │
       └─ Upgrade Modal Opens
          │
          ├─ Warning: "This action is permanent"
          │
          └─ Reseller Details Form
             • Account Type (dropdown)
             • Company Size (dropdown)
             • Industry (dropdown)
             • Tax ID (optional)
             • Registration# (optional)
             │
             └─ Validate
                │
                └─ Submit
                   ├─ Update account
                   ├─ Change business_type to "RESELLER"
                   ├─ Add reseller_details
                   ├─ Keep parent_reseller (lineage tracking)
                   │
                   └─ ✅ Upgrade Complete
                      └─ Reseller Features Unlocked
                         • Can register sub-resellers
                         • Can register clients
                         • Full reseller dashboard
```

---

## Registration Form Comparison

### CLIENT Form (5 Sections)

```
┌────────────────────────────────────┐
│ Account Type Selection             │
│ ⭕ CLIENT    RESELLER              │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Business Information               │
│ • Business Username *              │
│ • Business Name *                  │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Contact Information                │
│ • Contact Person *                 │
│ • Email *                          │
│ • Country * [Dropdown] 🔽          │
│ • Phone [Country Prefix] + input   │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Security                           │
│ • Password *                       │
│ • Confirm Password *               │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ [Create Account Button]            │
└────────────────────────────────────┘
```

### RESELLER Form (6 Sections)

```
┌────────────────────────────────────┐
│ Account Type Selection             │
│ CLIENT    ⭕ RESELLER              │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Business Information               │
│ • Business Username *              │
│ • Business Name *                  │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Contact Information                │
│ • Contact Person *                 │
│ • Email *                          │
│ • Country * [Dropdown] 🔽          │
│ • Phone [Country Prefix] + input   │
└────────────────────────────────────┘
┌─ RESELLER DETAILS ─────────────────┐
│ (Blue highlighted section)         │
│ • Account Type * [Dropdown] 🔽      │
│   └─ BASIC / PROFESSIONAL /        │
│      ENTERPRISE                    │
│ • Company Size * [Dropdown] 🔽      │
│   └─ 1-10 / 11-50 / 51-200 / ...   │
│ • Industry * [Dropdown] 🔽          │
│   └─ Marketing / Tech / Finance/.. │
│ • Tax ID / VAT Number              │
│ • Company Registration Number      │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Security                           │
│ • Password *                       │
│ • Confirm Password *               │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ [Create Account Button]            │
└────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────┐
│  User Registration                      │
│  /register                              │
└─────────────────────────────────────────┘
           │
           ├─ Select Account Type
           │  ├─ CLIENT
           │  └─ RESELLER
           │
           └─ Fill Form
              │
              ├─ Validation Layer
              │  ├─ Required fields
              │  ├─ Email format
              │  ├─ Password match
              │  └─ Unique username
              │
              └─ CreateAccount()
                 │
                 ├─ Generate account_sid
                 ├─ Set timestamp
                 ├─ Set parent_reseller (if sub-account)
                 │
                 └─ If RESELLER type:
                    ├─ Add reseller_details
                    ├─ Initialize sub_clients: []
                    ├─ Set account_type tier
                    ├─ Store tax_id, registration#
                    │
                    └─ Store in localStorage['mockAccounts']
                       │
                       ├─ Success ✅
                       ├─ Error ❌ (Duplicate username)
                       │
                       └─ Response
                          ├─ Account created
                          ├─ Redirect to /login
                          └─ User can immediately login
```

---

## Country & Phone Integration

### Country Selection Flow

```
User clicks Country dropdown
    ↓
Popup shows 40+ countries:
  • Code, Name, Phone Prefix
  • Examples:
    ├─ US (United States) +1
    ├─ GB (United Kingdom) +44
    ├─ KE (Kenya) +254
    ├─ IN (India) +91
    ├─ SG (Singapore) +65
    └─ ... 35 more
    ↓
User selects country (e.g., "Kenya")
    ↓
COUNTRY field = "KE"
PHONE PREFIX field auto-displays "+254"
    ↓
User enters phone number: "712123456"
    ↓
Stored as:
  {
    country: "KE",
    contact_phone: "712123456",
    phone_prefix: "+254"
  }
    ↓
Full number when displayed: "+254712123456"
```

---

## Mock Account Relationships

### Example Data Structure (localStorage)

```json
{
  "mockAccounts": [
    {
      "id": 1,
      "business_username": "acme",
      "business_name": "ACME Corporation",
      "business_type": "RESELLER",
      "contact_email": "admin@acme.com",
      "country": "US",
      "contact_phone": "2125551234",
      "account_sid": "AC_ACME",
      "created_at": "2025-12-04T10:00:00Z",
      "reseller_details": {
        "account_type": "PROFESSIONAL",
        "company_size": "201-500 employees",
        "industry": "Marketing Agency",
        "tax_id": "VAT123456789",
        "company_registration": "CR123456",
        "sub_clients": ["sales-team", "client-uk"],
        "created_date": "2025-12-04T10:00:00Z"
      }
    },
    {
      "id": 2,
      "business_username": "sales-team",
      "business_name": "ACME Sales Division",
      "business_type": "RESELLER",
      "contact_email": "sales@acme.com",
      "country": "GB",
      "contact_phone": "2071234567",
      "account_sid": "AC_SALES_TEAM",
      "created_at": "2025-12-04T10:30:00Z",
      "parent_reseller": "acme",
      "reseller_details": {
        "account_type": "BASIC",
        "company_size": "11-50 employees",
        "industry": "Marketing Agency",
        "sub_clients": ["client-europe"],
        "created_date": "2025-12-04T10:30:00Z"
      }
    },
    {
      "id": 3,
      "business_username": "client-uk",
      "business_name": "UK Marketing Ltd",
      "business_type": "CLIENT",
      "contact_email": "contact@ukmark.com",
      "country": "GB",
      "account_sid": "AC_CLIENT_UK",
      "created_at": "2025-12-04T10:45:00Z",
      "parent_reseller": "acme"
    },
    {
      "id": 4,
      "business_username": "client-europe",
      "business_name": "European Campaigns",
      "business_type": "CLIENT",
      "contact_email": "eu@campaigns.com",
      "country": "DE",
      "account_sid": "AC_CLIENT_EU",
      "created_at": "2025-12-04T11:00:00Z",
      "parent_reseller": "sales-team"
    }
  ]
}
```

---

## API Mock Methods (New)

### getSubAccounts()
```typescript
// Get all sub-accounts for a reseller
const subAccounts = await mockAuth.getSubAccounts("acme");

// Returns:
[
  {username: "sales-team", type: "RESELLER"},
  {username: "client-uk", type: "CLIENT"}
]
```

### upgradeToReseller()
```typescript
// Upgrade a client to reseller
const result = await mockAuth.upgradeToReseller("client-uk", {
  account_type: "PROFESSIONAL",
  company_size: "51-200 employees",
  industry: "Telecommunications"
});

// Result: client-uk now has RESELLER role
// Can register sub-accounts
// parent_reseller preserved for lineage
```

---

## Testing Checklist

- [ ] **Registration**
  - [ ] CLIENT account creation
  - [ ] RESELLER account creation
  - [ ] Duplicate username prevention
  - [ ] Password validation
  - [ ] Email validation

- [ ] **Country Selection**
  - [ ] Dropdown shows all 40+ countries
  - [ ] Phone prefix auto-displays
  - [ ] Correct prefix for each country
  - [ ] Phone input without prefix

- [ ] **Cross-Role Registration**
  - [ ] Reseller can register sub-reseller
  - [ ] Reseller can register client
  - [ ] Parent-child relationship tracking
  - [ ] Sub-accounts can login

- [ ] **Client Upgrade**
  - [ ] Client can upgrade to reseller
  - [ ] Reseller details required
  - [ ] Lineage preserved
  - [ ] New permissions granted

- [ ] **UI/UX**
  - [ ] Forms responsive (mobile to desktop)
  - [ ] Success/error messages display
  - [ ] Icons appear correctly
  - [ ] Modal dialogs work smoothly

- [ ] **Data**
  - [ ] localStorage updates correctly
  - [ ] Parent-child relationships saved
  - [ ] All fields persisted
  - [ ] Data survives page refresh

---

## Production Migration Checklist

- [ ] **Backend API**
  - [ ] Create `/api/auth/register` endpoint
  - [ ] Create `/api/auth/sub-register` endpoint
  - [ ] Create `/api/reseller/upgrade` endpoint
  - [ ] Implement server-side validation

- [ ] **Database**
  - [ ] Create accounts table
  - [ ] Create reseller_details table
  - [ ] Create sub_accounts relationship table
  - [ ] Add indexes on parent_reseller

- [ ] **Security**
  - [ ] Hash passwords with bcrypt
  - [ ] Add rate limiting
  - [ ] Add CSRF protection
  - [ ] Add email verification

- [ ] **Integration**
  - [ ] Update api.ts with real endpoints
  - [ ] Remove mock localStorage
  - [ ] Add error handling
  - [ ] Add retry logic

