# Quick Implementation Guide for Reusable Components

## 📦 Components Created

### 1. **StatCard** - `components/ui/StatCard.tsx`
Display key metrics with icon, label, value, and optional trend.

```tsx
import { StatCard } from '@/components/ui/StatCard';
import { Users } from 'lucide-react';

<StatCard
  icon={<Users size={24} style={{ color: 'var(--primary)' }} />}
  label="Active Clients"
  value={42}
  change="+5 this month"
  trend="up"
/>
```

---

### 2. **StatusBadge** - `components/ui/StatusBadge.tsx`
Display status with automatic color coding.

```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';

<StatusBadge status="delivered" size="md" />
// Also supports: queued, pending, failed, sent, active, inactive
```

---

### 3. **ListCard** - `components/ui/ListCard.tsx`
Generic list container with custom item rendering.

```tsx
import { ListCard } from '@/components/ui/ListCard';

<ListCard
  title="Recent Messages"
  items={messages}
  renderItem={(msg, idx) => (
    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
      <p>{msg.to}</p>
      <StatusBadge status={msg.status} />
    </div>
  )}
  emptyMessage="No messages found"
  maxItems={5}
/>
```

---

### 4. **QuickActionsCard** - `components/ui/QuickActionsCard.tsx`
Navigation card with quick action buttons.

```tsx
import { QuickActionsCard } from '@/components/ui/QuickActionsCard';
import { MessageSquare, Wallet } from 'lucide-react';

<QuickActionsCard
  title="Quick Actions"
  actions={[
    { label: 'Send SMS', href: '/client/sms', icon: <MessageSquare size={18} /> },
    { label: 'Top Up', href: '/client/wallet', icon: <Wallet size={18} /> },
  ]}
/>
```

---

### 5. **AlertBox** - `components/ui/AlertBox.tsx`
Display error, success, warning, or info messages.

```tsx
import { AlertBox } from '@/components/ui/AlertBox';

<AlertBox
  type="error"
  message="Failed to send SMS"
  onClose={() => setError(null)}
  dismissible
/>
```

---

## 🛠️ Utilities Created

### 1. **Formatters** - `lib/formatters.ts`
Common data formatting functions.

```tsx
import {
  formatDate,
  formatCurrency,
  formatPercentage,
  formatStatusDisplay,
  truncateText,
} from '@/lib/formatters';

formatDate('2025-01-15T10:30:00')              // "1/15/2025, 10:30:00 AM"
formatCurrency(1250.50)                         // "USD 1250.50"
formatPercentage(0.982)                         // "98.2%"
formatStatusDisplay('sent')                     // "Sent"
truncateText('Long text here', 10)              // "Long text..."
```

---

### 2. **Status Colors** - `lib/constants/statusColors.ts`
Consistent status color definitions.

```tsx
import { STATUS_COLORS, getStatusColor } from '@/lib/constants/statusColors';

// Get all colors for a status
const colors = getStatusColor('delivered');
// { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', light: 'bg-green-50' }

// Access directly
STATUS_COLORS.failed.bg  // 'bg-red-100'
```

---

### 3. **Role-Based Routing** - `lib/auth/roleBasedRouting.ts`
Role management and navigation utilities.

```tsx
import {
  getRoleBasedRoute,
  getRoleNavItems,
  getRoleDisplayName,
  hasRole,
} from '@/lib/auth/roleBasedRouting';

getRoleBasedRoute('PLATFORM_ADMIN')             // "/platform/dashboard"
getRoleNavItems('CLIENT_ADMIN')                 // [{ label: 'Dashboard', ... }]
getRoleDisplayName('RESELLER_ADMIN')            // "Reseller"
hasRole(userRole, 'PLATFORM_ADMIN')             // true/false
```

---

## 🔄 Migration Examples

### Before (Old Way - Duplicated Code)
```tsx
// In 3 different dashboard pages
function StatCard({ icon, label, value, change }) {
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

### After (New Way - Reusable Component)
```tsx
import { StatCard } from '@/components/ui/StatCard';

<StatCard icon={icon} label={label} value={value} change={change} />
```

---

### Before (Status Badge - Repeated Ternary)
```tsx
<span className={`px-3 py-1 text-xs rounded-full font-medium ${
  msg.status === 'delivered'
    ? 'bg-green-100 text-green-800'
    : msg.status === 'queued'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800'
}`}>
  {msg.status}
</span>
```

### After (Status Badge - Clean Component)
```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';

<StatusBadge status={msg.status} />
```

---

### Before (Alert Box - Repeated Pattern)
```tsx
{error && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-red-700">{error}</p>
  </div>
)}
```

### After (Alert Box - Reusable)
```tsx
import { AlertBox } from '@/components/ui/AlertBox';

{error && <AlertBox type="error" message={error} onClose={() => setError(null)} />}
```

---

## 📋 File Updates Needed

### To migrate existing dashboards, update:

1. **`app/client/dashboard/page.tsx`**
   - Remove local `StatCard` function
   - Import and use `<StatCard />`
   - Update `ListCard` usage
   - Replace error alerts with `<AlertBox />`

2. **`app/platform/dashboard/page.tsx`**
   - Remove local `StatCard` function
   - Import and use `<StatCard />`
   - Use `<ListCard />` for activity feed
   - Use `<QuickActionsCard />` for actions

3. **`app/reseller/dashboard/page.tsx`**
   - Same as above

4. **`features/auth/components/RegisterForm.tsx`**
   - Replace alert divs with `<AlertBox />`
   - Use `formatDate()` where needed

5. **`app/(auth)/login/page.tsx`**
   - Replace alert divs with `<AlertBox />`

---

## ✅ Next Steps

1. **Test** the new components in a page
2. **Update** one dashboard at a time
3. **Verify** functionality after each update
4. **Remove** old duplicated code
5. **Update** all remaining pages

---

## 📚 Full Component API

### StatCard Props
```tsx
interface StatCardProps {
  icon: React.ReactNode;           // Icon to display
  label: string;                   // Stat label
  value: string | number;          // Stat value
  change?: string;                 // Optional change indicator (e.g., "+5")
  trend?: 'up' | 'down' | 'neutral'; // Color indicator
  className?: string;              // Additional CSS classes
}
```

### StatusBadge Props
```tsx
interface StatusBadgeProps {
  status: StatusType;              // Status value
  className?: string;              // Additional CSS classes
  size?: 'sm' | 'md' | 'lg';       // Badge size
  showLabel?: boolean;             // Show display name or raw status
}
```

### ListCard Props
```tsx
interface ListCardProps {
  title: string;                   // Card title
  items: any[];                    // List items
  renderItem: (item, index) => ReactNode; // Custom item renderer
  emptyMessage?: string;           // Message when empty
  className?: string;              // Additional CSS classes
  maxItems?: number;               // Limit displayed items
}
```

### QuickActionsCard Props
```tsx
interface QuickActionsCardProps {
  title?: string;                  // Card title
  actions: QuickAction[];          // Action buttons
  className?: string;              // Additional CSS classes
}

interface QuickAction {
  label: string;                   // Button label
  href?: string;                   // Navigation URL
  onClick?: () => void;            // Click handler
  icon?: React.ReactNode;          // Optional icon
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### AlertBox Props
```tsx
interface AlertBoxProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string | React.ReactNode;
  icon?: React.ReactNode;          // Optional custom icon
  onClose?: () => void;            // Dismiss handler
  className?: string;              // Additional CSS classes
  dismissible?: boolean;           // Show close button
}
```

---

## 🚀 Performance Benefits

- **Reduced Code:** ~755 lines saved
- **Consistency:** Single source of truth for UI patterns
- **Maintainability:** Update once, everywhere
- **Type Safety:** Full TypeScript support
- **Accessibility:** Built-in best practices
- **Reusability:** Use across all features

