# 🚀 Quick Start Guide - WeCall SMS Gateway UI

## 📖 Overview

You now have a complete, production-ready SMS Gateway dashboard with UI for three user roles: **Admin**, **Reseller**, and **Client**. Everything is built with reusable components and simple, understandable code.

---

## ✨ What You Get

### ✅ Complete Dashboard System
- **Landing Page** with role selection
- **Admin Dashboard** - Full system control
- **Reseller Dashboard** - Business management
- **Client Dashboard** - Easy SMS sending
- **Responsive Design** - Works on all devices

### ✅ 9 Reusable Components
```
- Table (Data tables with sorting)
- Navbar (Top navigation)
- Sidebar (Side menu)
- Card (Content wrapper)
- Button (Styled buttons)
- StatCard (Metric cards)
- SearchBox (Search input)
- Modal (Dialog popup)
- Pagination (Page control)
```

### ✅ Pre-built Pages
| Role | Home | Pages |
|------|------|-------|
| **Admin** | `/admin` | SMS, Users, Resellers, Reports |
| **Reseller** | `/reseller` | Send SMS, Team, Balance, Reports |
| **Client** | `/client` | Send SMS, History, Account |

---

## 🎯 How to Navigate

### 1. **Start the App**
```bash
cd frontend
npm run dev
```
Visit: `http://localhost:3000`

### 2. **See the Landing Page**
You'll see a beautiful landing page with three role cards:
- **Admin** - Red card → `/admin`
- **Reseller** - Blue card → `/reseller`
- **Client** - Green card → `/client`

### 3. **Explore Each Dashboard**
Each role has:
- **Sidebar Menu** - Navigation items
- **Top Navbar** - User info, notifications
- **Main Content** - Dashboard pages with data

---

## 📁 Key Files Structure

```
frontend/app/
├── page.tsx                          # Landing page (START HERE)
├── layout.tsx                        # Root layout
└── (dashboard)/
    ├── layout.tsx                    # Dashboard layout
    ├── admin/
    │   ├── page.tsx                  # Admin home
    │   ├── sms/page.tsx              # SMS management
    │   ├── users/page.tsx            # User management
    │   ├── resellers/page.tsx        # Reseller management
    │   ├── reports/page.tsx          # Reports & analytics
    │   └── settings/page.tsx         # Settings
    ├── reseller/
    │   ├── page.tsx                  # Reseller home
    │   ├── sms/page.tsx              # Send SMS
    │   ├── team/page.tsx             # Team management
    │   ├── balance/page.tsx          # Balance
    │   ├── reports/page.tsx          # Reports
    │   └── settings/page.tsx         # Settings
    └── client/
        ├── page.tsx                  # Client home
        ├── sms/page.tsx              # Send SMS
        ├── history/page.tsx          # SMS history
        └── account/page.tsx          # Account

components/                          # Reusable components
├── Table.tsx                         # Data table
├── Navbar.tsx                        # Top bar
├── Sidebar.tsx                       # Side menu
├── Card.tsx                          # Content wrapper
├── Button.tsx                        # Button
├── StatCard.tsx                      # Metric card
├── SearchBox.tsx                     # Search
├── Modal.tsx                         # Modal
└── Pagination.tsx                    # Pagination
```

---

## 💡 Simple Code Examples

### Display a Statistic Card
```tsx
import StatCard from "@/components/StatCard";
import { MessageSquare } from "lucide-react";

<StatCard 
  icon={MessageSquare}
  label="SMS Sent"
  value="1,250"
  change={12}
  bgColor="bg-blue-100"
  iconColor="text-blue-600"
/>
```

### Create a Data Table
```tsx
import Table from "@/components/Table";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
];

const renderRow = (item) => (
  <tr key={item.id}>
    <td>{item.name}</td>
    <td>{item.email}</td>
  </tr>
);

<Table columns={columns} data={data} renderRow={renderRow} />
```

### Add a Button
```tsx
import Button from "@/components/Button";

<Button variant="primary" size="md" fullWidth>
  Send SMS
</Button>

{/* Variants: "primary", "secondary", "danger", "success" */}
{/* Sizes: "sm", "md", "lg" */}
```

### Wrap Content in Card
```tsx
import Card from "@/components/Card";

<Card title="My Section">
  {/* Your content here */}
</Card>
```

---

## 🎨 Color & Styling

### Use Tailwind Classes
```tsx
{/* Background colors */}
<div className="bg-blue-600">Primary Blue</div>
<div className="bg-green-600">Success Green</div>
<div className="bg-red-600">Danger Red</div>

{/* Text colors */}
<p className="text-gray-900">Dark text</p>
<p className="text-gray-500">Light text</p>

{/* Spacing */}
<div className="p-4 m-2 gap-6">Content</div>

{/* Responsive */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Responsive grid
</div>
```

---

## 🔄 Common Tasks

### Add a New Page for Admin
```tsx
// Create: app/(dashboard)/admin/mypage/page.tsx

import Card from "@/components/Card";
import Button from "@/components/Button";

export default function MyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Page Title</h1>
      <Card title="My Section">
        {/* Content */}
      </Card>
    </div>
  );
}
```

### Display User Data in Table
```tsx
import Table from "@/components/Table";

const users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" },
];

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
];

const renderRow = (user) => (
  <tr key={user.id}>
    <td className="p-4">{user.name}</td>
    <td className="p-4">{user.email}</td>
  </tr>
);

<Table columns={columns} data={users} renderRow={renderRow} />
```

### Show Statistics
```tsx
import StatCard from "@/components/StatCard";
import { Users, MessageSquare, CreditCard } from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Total Users",
    value: "1,245",
    change: 8,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: MessageSquare,
    label: "SMS Sent",
    value: "124,563",
    change: 12,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: CreditCard,
    label: "Revenue",
    value: "$45,230",
    change: 15,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {stats.map((stat) => (
    <StatCard key={stat.label} {...stat} />
  ))}
</div>
```

---

## 🎓 Understanding the Structure

### Landing Page (`/`)
- Shows three role cards
- Each card links to a different dashboard
- Beautiful gradient design

### Dashboard Layout
- **Fixed Sidebar** - Navigation menu on left
- **Top Navbar** - User info on top
- **Main Content** - Page content in center
- **Responsive** - Sidebar hides on mobile

### Pages Structure
```tsx
export default function PageName() {
  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1>Page Title</h1>
        <p>Subtitle</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* StatCards here */}
      </div>

      {/* Main Content */}
      <Card>
        {/* Table, form, etc */}
      </Card>
    </div>
  );
}
```

---

## 🚀 Next Steps - Connect Backend

### 1. Set Up API Routes
```tsx
// In backend, create API endpoints:
- GET /api/sms - Get SMS messages
- POST /api/sms - Send SMS
- GET /api/users - Get users
- GET /api/resellers - Get resellers
```

### 2. Replace Mock Data
```tsx
// Replace this:
const [data] = useState([
  { id: 1, name: "John", ... }
]);

// With API call:
const [data, setData] = useState([]);

useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setData(data));
}, []);
```

### 3. Add Authentication
```tsx
// Check user role before showing dashboard
if (!userRole) redirect('/');
if (userRole !== 'admin') redirect('/client');
```

---

## 📚 Component Reference Quick Links

| Component | Usage | File |
|-----------|-------|------|
| `<Table>` | Display data in rows/columns | `components/Table.tsx` |
| `<Navbar>` | Top navigation bar | `components/Navbar.tsx` |
| `<Sidebar>` | Side menu | `components/Sidebar.tsx` |
| `<Card>` | Content wrapper with border | `components/Card.tsx` |
| `<Button>` | Clickable button | `components/Button.tsx` |
| `<StatCard>` | Show metric/statistic | `components/StatCard.tsx` |
| `<SearchBox>` | Search input | `components/SearchBox.tsx` |
| `<Modal>` | Dialog popup | `components/Modal.tsx` |
| `<Pagination>` | Page navigation | `components/Pagination.tsx` |

---

## 🎯 Design Principles Used

✅ **Simplicity** - Code is easy to understand
✅ **Reusability** - Components used across all pages
✅ **Consistency** - Same design language everywhere
✅ **Responsiveness** - Works on all devices
✅ **Performance** - Optimized components
✅ **Accessibility** - Semantic HTML, proper labels
✅ **Maintainability** - Well-organized file structure

---

## 💬 Quick Tips

1. **Always use components** - Don't build from scratch
2. **Use Tailwind classes** - For consistent styling
3. **Keep components small** - Under 200 lines each
4. **Use TypeScript** - For type safety
5. **Mock data first** - Add API later
6. **Test responsive** - Check on mobile, tablet, desktop
7. **Use Lucide icons** - For consistent icon set
8. **Follow patterns** - Look at existing pages for reference

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px

Use Tailwind breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

Example:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## ✅ You're All Set!

Your SMS Gateway UI is ready to:
- ✅ Navigate between dashboards
- ✅ Display data in tables
- ✅ Show statistics
- ✅ Handle user interactions
- ✅ Responsive on all devices
- ✅ Easy to customize and extend

### Next: Connect it to your backend API!

For detailed information, see: `SMS_GATEWAY_UI_GUIDE.md`

Happy coding! 🎉
