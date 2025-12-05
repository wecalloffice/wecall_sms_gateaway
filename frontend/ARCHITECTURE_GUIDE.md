# Frontend Architecture Overview

## Component Hierarchy

```
App Root
│
├── Login Page (public)
│   ├── LoginForm
│   └── Role Detection → Redirect to appropriate dashboard
│
├── Platform Admin Dashboard
│   └── MainLayout (role="PLATFORM_ADMIN")
│       ├── Sidebar (Platform menu)
│       ├── Topbar (Platform branding)
│       └── Dashboard Content
│           ├── Stats Cards
│           ├── Recent Activity
│           └── Quick Actions
│
├── Reseller Dashboard
│   └── MainLayout (role="RESELLER_ADMIN")
│       ├── Sidebar (Reseller menu)
│       ├── Topbar (Reseller branding)
│       └── Dashboard Content
│           ├── Stats Cards
│           ├── Top Clients
│           └── Quick Actions
│
└── Client Dashboard
    └── MainLayout (role="CLIENT_ADMIN")
        ├── Sidebar (Client menu)
        ├── Topbar (Client branding)
        └── Dashboard Content
            ├── Stats Cards
            ├── Recent Messages
            └── Quick Actions
```

## Data Flow

```
User Login
    ↓
[Login Page] → Mock Auth API
    ↓
Set localStorage:
  - authToken
  - userRole
  - username
    ↓
Role-based Redirect:
  - PLATFORM_ADMIN → /platform/dashboard
  - RESELLER_ADMIN → /reseller/dashboard
  - CLIENT_ADMIN → /client/dashboard
    ↓
[Dashboard Page] → Load MainLayout
    ↓
MainLayout → Pass role prop
    ↓
    ├── Sidebar renders role-specific menu
    ├── Topbar shows business name & user
    └── Children renders dashboard content
```

## Feature Module Pattern

```
Feature Module (e.g., SMS)
│
├── api.ts
│   └── Functions to call backend endpoints
│       - sendSms()
│       - getSmsHistory()
│       - getSmsById()
│
├── hooks.ts
│   └── Custom React hooks
│       - useSendSms()
│       - useSmsHistory()
│       - useSmsFilters()
│
├── types.ts
│   └── TypeScript interfaces
│       - SmsMessage
│       - SmsStatus
│       - SendSmsRequest
│
└── components/
    ├── send-sms-form.tsx
    │   └── Form to send SMS
    └── sms-list.tsx
        └── Display SMS history
```

## State Management

```
Authentication State
    ↓
lib/stores/auth-store.ts
    ↓
    ├── getAuthState() - Read from localStorage
    ├── setAuthState() - Write to localStorage
    └── clearAuthState() - Remove from localStorage
```

## Mock Data Architecture

```
mocks/data/wecallMockData.ts
    ↓
Normalized data structure:
  - users[]
  - accounts[]
  - smsMessages[]
  - transactions[]
  - connectors[]
  - logEvents[]
    ↓
mocks/adapters/
    ↓
    ├── mockAuth.ts → User authentication
    ├── mockAccounts.ts → Resellers & clients
    ├── mockSms.ts → SMS messages
    ├── mockBilling.ts → Transactions
    ├── mockRouting.ts → Connectors
    ├── mockObservability.ts → Logs
    └── mockStaff.ts → Staff members
```

## Navigation Flow

### Platform Admin Routes
```
/platform/dashboard   → Platform overview
/platform/resellers   → Manage resellers
/platform/clients     → View all clients
/platform/routing     → SMS routing config
/platform/billing     → Platform billing
/platform/logs        → System logs
```

### Reseller Routes
```
/reseller/dashboard   → Reseller overview
/reseller/clients     → Manage clients
/reseller/billing     → Reseller billing
/reseller/sms-logs    → SMS history
```

### Client Routes
```
/client/dashboard     → Client overview
/client/send-sms      → Send SMS interface
/client/sms-logs      → SMS history
/client/billing       → Client billing
```

## Utility Functions

### Format Utils (`lib/utils/format.ts`)
- `formatCurrency(amount, currency)` → "KES 1,250.50"
- `formatDate(date, format)` → "Dec 4, 2025"
- `formatPhoneNumber(phone)` → "+254 788 000 111"
- `truncateText(text, maxLength)` → "Lorem ipsum..."

### ID Utils (`lib/utils/ids.ts`)
- `generateId(prefix)` → Random unique ID
- `generateAccountSid()` → "AC_xxx"
- `generateSmsId()` → "SMS_xxx"
- `generateTransactionId()` → "TXN_xxx"

### Validation Utils (`lib/utils/validate.ts`)
- `isValidEmail(email)` → boolean
- `isValidPhoneNumber(phone)` → boolean
- `isValidSmsMessage(message)` → boolean
- `isStrongPassword(password)` → boolean

## Custom Hooks

### Pagination Hook (`lib/hooks/use-pagination.ts`)
```tsx
const { currentPage, totalPages, goToPage, nextPage, prevPage } = 
  usePagination(totalItems, itemsPerPage);
```

### Debounce Hook (`lib/hooks/use-debounce.ts`)
```tsx
const debouncedValue = useDebounce(searchTerm, 500);
```

## Styling Classes

### Navigation Links
- `.nav-link` - Default link style
- `.nav-link-active` - Active route style (in Sidebar)

### Buttons
- `.btn-primary` - Primary action button

### Layout
- Flexbox-based responsive layout
- Tailwind CSS utility classes
- Custom CSS variables:
  - `--primary` - Brand primary color
  - `--primary-accent` - Lighter accent color
  - `--primary-light` - Light variant

## File Organization Best Practices

1. **Components**: React components with PascalCase names
2. **Files**: TypeScript files with kebab-case names
3. **Folders**: kebab-case for feature folders
4. **Exports**: Use index.ts for barrel exports
5. **Types**: Co-locate types with features, shared types in `lib/types/`
6. **API**: Keep API calls in feature `api.ts` files
7. **Hooks**: Feature hooks in feature `hooks.ts`, shared in `lib/hooks/`
8. **Utils**: Shared utilities in `lib/utils/`

## Import Patterns

```tsx
// Layout components
import { MainLayout } from '@/components/layout';

// Feature components
import { SendSmsForm } from '@/features/sms/components/send-sms-form';

// Utilities
import { formatCurrency } from '@/lib/utils/format';

// Hooks
import { usePagination } from '@/lib/hooks/use-pagination';

// Types
import type { UserRole, SmsStatus } from '@/lib/types/core';

// Store
import { authStore } from '@/lib/stores/auth-store';

// Mock adapters
import { mockAuth } from '@/mocks/adapters/mockAuth';
```

---

**All structural requirements have been successfully implemented!** ✅
