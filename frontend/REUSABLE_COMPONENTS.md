# Reusable Components & Patterns Analysis

## 🎯 Overview
This document identifies reusable components, patterns, and utilities found across the WeCall SMS platform that should be extracted into shared component libraries.

---

## 📦 **TIER 1: CRITICAL REUSABLE COMPONENTS** (Extract NOW)

### 1. **StatCard Component** ⭐⭐⭐
**Current Status:** Duplicated in 3+ dashboards  
**Files:** 
- `app/client/dashboard/page.tsx` (lines 10-42)
- `app/platform/dashboard/page.tsx` (lines 18-50)
- `app/reseller/dashboard/page.tsx` (lines 20-52)

**Pattern:**
```tsx
function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs mt-2 text-green-600">{change}</p>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-accent)' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
```

**Recommendation:** Extract to `components/ui/StatCard.tsx`  
**Props Enhancement:**
```tsx
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';  // For color coding
  className?: string;
}
```

---

### 2. **MessageList / ActivityList Component** ⭐⭐⭐
**Current Status:** Similar patterns in all dashboards  
**Files:**
- `app/client/dashboard/page.tsx` (lines 102-134)
- `app/platform/dashboard/page.tsx` (lines 118-150)
- `app/reseller/dashboard/page.tsx` (lines 142-177)

**Pattern:**
```tsx
<div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h2>
  <div className="space-y-3">
    {messages.length > 0 ? (
      messages.map((msg, i) => (
        <div key={msg.sid} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">{msg.to}</p>
            <p className="text-xs text-gray-500">{formatDate(msg.created_at)}</p>
          </div>
          <StatusBadge status={msg.status} />
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No messages</p>
    )}
  </div>
</div>
```

**Recommendation:** Extract to `components/ui/ListCard.tsx` or `components/ui/ActivityList.tsx`  
**Props:**
```tsx
interface ListCardProps {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}
```

---

### 3. **StatusBadge Component** ⭐⭐⭐
**Current Status:** Inline conditional styling repeated  
**Files:**
- `app/client/dashboard/page.tsx` (lines 123-130)
- `app/platform/dashboard/page.tsx` (inline)
- SMS list views

**Pattern:**
```tsx
<span className={`px-3 py-1 text-xs rounded-full font-medium ${
  msg.status === 'delivered'
    ? 'bg-green-100 text-green-800'
    : msg.status === 'queued' || msg.status === 'pending'
      ? 'bg-yellow-100 text-yellow-800'
      : msg.status === 'failed'
        ? 'bg-red-100 text-red-800'
        : 'bg-gray-100 text-gray-800'
}`}>
  {msg.status}
</span>
```

**Recommendation:** Extract to `components/ui/StatusBadge.tsx`  
**Props:**
```tsx
interface StatusBadgeProps {
  status: 'delivered' | 'queued' | 'pending' | 'failed' | 'sent';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusMap = {
  'delivered': { bg: 'bg-green-100', text: 'text-green-800' },
  'queued': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'failed': { bg: 'bg-red-100', text: 'text-red-800' },
  'sent': { bg: 'bg-blue-100', text: 'text-blue-800' },
};
```

---

### 4. **QuickActionButtons Component** ⭐⭐⭐
**Current Status:** Duplicated section in 3 dashboards  
**Files:**
- `app/client/dashboard/page.tsx` (lines 135-152)
- `app/platform/dashboard/page.tsx` (lines 151-169)
- `app/reseller/dashboard/page.tsx` (lines 178-200)

**Pattern:**
```tsx
<div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
  <div className="space-y-2">
    <button onClick={() => router.push('/client/sms')} className="btn-primary w-full text-left px-4 py-3">
      Send SMS
    </button>
    <button onClick={() => router.push('/client/sms-logs')} className="btn-primary w-full text-left px-4 py-3">
      View SMS Logs
    </button>
  </div>
</div>
```

**Recommendation:** Extract to `components/ui/QuickActionsCard.tsx`  
**Props:**
```tsx
interface QuickAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface QuickActionsCardProps {
  title?: string;
  actions: QuickAction[];
  className?: string;
}
```

---

## 📦 **TIER 2: HIGH-PRIORITY REUSABLE PATTERNS**

### 5. **Form Field Pattern** ⭐⭐
**Current Status:** Repeated in RegisterForm, multiple pages  
**Files:**
- `features/auth/components/RegisterForm.tsx` (hundreds of lines)

**Pattern:**
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
    <Icon size={16} />
    Field Label <span className="text-red-600">*</span>
  </label>
  <input
    type="text"
    placeholder="placeholder"
    value={form.fieldName}
    onChange={(e) => update("fieldName", e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    required
  />
  <p className="text-xs text-gray-500">Helper text</p>
</div>
```

**Recommendation:** Extract to `components/ui/FormField.tsx`  
**Props:**
```tsx
interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}
```

---

### 6. **Error Message Box** ⭐⭐
**Current Status:** Repeated in auth pages and forms  
**Files:**
- `app/(auth)/login/page.tsx` (lines 60-65)
- `features/auth/components/RegisterForm.tsx` (lines 70-76)

**Pattern:**
```tsx
{error && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-red-700">{error}</p>
  </div>
)}
```

**Recommendation:** Extract to `components/ui/AlertBox.tsx`  
**Props:**
```tsx
interface AlertBoxProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}
```

---

### 7. **Demo Info Box** ⭐⭐
**Current Status:** Same pattern in login/register  
**Files:**
- `app/(auth)/login/page.tsx` (lines 77-90)

**Pattern:**
```tsx
<div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
  <ul className="text-xs text-blue-800 space-y-1">
    <li>• <strong>Platform Admin:</strong> username "admin"</li>
    <li>• <strong>Reseller:</strong> username "kcb"</li>
  </ul>
</div>
```

**Recommendation:** Extract to `components/ui/InfoBox.tsx`  
**Props:**
```tsx
interface InfoBoxProps {
  title: string;
  items: string[];
  variant?: 'info' | 'tip' | 'note';
  className?: string;
}
```

---

### 8. **Card Grid Layout** ⭐⭐
**Current Status:** Repeated in all 3 dashboards  
**Pattern:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* StatCards */}
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Content sections */}
</div>
```

**Recommendation:** Already using Tailwind - create layout utilities in `lib/tailwind-patterns.ts`

---

## 📦 **TIER 3: UTILITY & HELPER FUNCTIONS**

### 9. **Data Formatting Functions** ⭐
**Current Issues:** Date formatting done inline multiple times  
**Recommendation:** Create `lib/formatters.ts`
```tsx
// lib/formatters.ts
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return `${currency} ${amount.toFixed(2)}`;
};

export const formatPhoneNumber = (phone: string, prefix: string) => {
  return `${prefix}${phone}`;
};

export const formatStatusDisplay = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};
```

---

### 10. **Mock Data Hooks** ⭐
**Current Status:** Multiple useEffect patterns fetching data  
**Recommendation:** Create `lib/hooks/useMockData.ts`
```tsx
// lib/hooks/useMockData.ts
export function useClientData(clientId: string) {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logic
  }, [clientId]);

  return { client, messages, loading };
}

export function useResellerData(resellerId: string) {
  // Similar pattern
}

export function usePlatformData() {
  // Similar pattern
}
```

---

### 11. **Role-Based Routing Helper** ⭐
**Current Status:** Hardcoded in `features/auth/hooks.ts`  
**Recommendation:** Extract to `lib/auth/roleBasedRouting.ts`
```tsx
// lib/auth/roleBasedRouting.ts
export const getRoleBasedRoute = (role: string) => {
  const routes = {
    'PLATFORM_ADMIN': '/platform/dashboard',
    'RESELLER_ADMIN': '/reseller/dashboard',
    'CLIENT_ADMIN': '/client/dashboard',
  };
  return routes[role] || '/';
};
```

---

### 12. **Status Color Map** ⭐
**Current Status:** Repeated in multiple places  
**Recommendation:** Create `lib/constants/statusColors.ts`
```tsx
// lib/constants/statusColors.ts
export const STATUS_COLORS = {
  'delivered': { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
  'queued': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
  'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
  'failed': { bg: 'bg-red-100', text: 'text-red-800', icon: '✗' },
  'sent': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '→' },
  'active': { bg: 'bg-green-100', text: 'text-green-800', icon: '●' },
  'inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: '◯' },
};
```

---

## 🎨 **TIER 4: DESIGN SYSTEM IMPROVEMENTS**

### 13. **Existing UI Components (Already Available)**
These are already in `components/ui/`:
- ✅ `Button.tsx` - Use with variants
- ✅ `Card.tsx` - Use for content sections
- ✅ `Dialog.tsx` - Use for modals
- ✅ `Form.tsx` - Use for form handling
- ✅ `Input.tsx` - Use for text inputs
- ✅ `Label.tsx` - Use for form labels
- ✅ `Select.tsx` - Use for dropdowns
- ✅ `Badge.tsx` - Use for tags/labels
- ✅ `Pagination.tsx` - Use for list pagination
- ✅ `Table.tsx` - Use for data tables

**Action:** Migrate from `.btn-primary` CSS class to `<Button>` component

---

### 14. **CSS Utility Classes to Refactor**
**Current:** Using inline Tailwind + CSS utilities  
**Recommendation:** Create Tailwind utility layer
```tsx
// app/globals.css - Add to @layer utilities
@layer utilities {
  .card-hover {
    @apply hover:shadow-lg transition-shadow duration-200;
  }
  
  .form-input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary 
           focus:border-transparent;
  }
  
  .section-spacing {
    @apply space-y-6;
  }
  
  .grid-dashboard {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
  }
  
  .grid-content {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
  }
}
```

---

## 📋 **EXTRACTION ROADMAP**

### **Phase 1: Critical Components** (Immediate)
```
Priority 1 - Extract these first (saves 300+ lines):
├── StatCard.tsx
├── StatusBadge.tsx
├── ListCard.tsx
├── QuickActionsCard.tsx
└── AlertBox.tsx
```

### **Phase 2: Utilities** (Week 1)
```
├── lib/formatters.ts
├── lib/constants/statusColors.ts
├── lib/auth/roleBasedRouting.ts
└── lib/hooks/useMockData.ts
```

### **Phase 3: Migration** (Week 2)
```
├── Migrate all .btn-primary → <Button>
├── Migrate all inline status badges → <StatusBadge>
├── Migrate all form fields → <FormField>
└── Add Tailwind utility layers
```

---

## 💾 **Files to Create**

### New Component Files:
```
components/ui/
├── StatCard.tsx           (NEW)
├── StatusBadge.tsx        (NEW)
├── ListCard.tsx           (NEW)
├── QuickActionsCard.tsx   (NEW)
├── AlertBox.tsx           (NEW)
├── FormField.tsx          (NEW)
└── InfoBox.tsx            (NEW)

lib/
├── formatters.ts          (NEW)
├── constants/
│   └── statusColors.ts    (NEW)
├── auth/
│   └── roleBasedRouting.ts (NEW)
├── hooks/
│   └── useMockData.ts     (NEW)
└── tailwind-patterns.ts   (NEW)
```

---

## 📊 **Impact Analysis**

| Component | Duplicates | Lines to Save | Maintenance Improvement |
|-----------|-----------|---------------|----------------------|
| StatCard | 3 | ~90 | ⭐⭐⭐ |
| ListCard | 4+ | ~150 | ⭐⭐⭐ |
| StatusBadge | 5+ | ~75 | ⭐⭐⭐ |
| QuickActionsCard | 3 | ~80 | ⭐⭐ |
| AlertBox | 3+ | ~60 | ⭐⭐ |
| FormField | 20+ | ~300 | ⭐⭐⭐ |
| **TOTAL** | - | **~755** | **~90% reduction in duplication** |

---

## ✅ **Quick Implementation Checklist**

- [ ] Extract StatCard to `components/ui/StatCard.tsx`
- [ ] Extract StatusBadge to `components/ui/StatusBadge.tsx`
- [ ] Create `lib/constants/statusColors.ts`
- [ ] Create `lib/formatters.ts`
- [ ] Extract ListCard to `components/ui/ListCard.tsx`
- [ ] Extract QuickActionsCard to `components/ui/QuickActionsCard.tsx`
- [ ] Update all dashboard pages to use new components
- [ ] Add Tailwind utility layers to `globals.css`
- [ ] Update auth pages to use AlertBox
- [ ] Create FormField component
- [ ] Add role-based routing utility
- [ ] Create mock data hooks
- [ ] Migrate from `.btn-primary` class to `<Button>` component
- [ ] Add unit tests for new components
- [ ] Update component library documentation

---

## 🎯 **Next Steps**

1. **Review** this document with the team
2. **Prioritize** extraction (Phase 1 critical)
3. **Create** new component files
4. **Test** each component thoroughly
5. **Migrate** existing pages to use new components
6. **Document** component usage in Storybook

