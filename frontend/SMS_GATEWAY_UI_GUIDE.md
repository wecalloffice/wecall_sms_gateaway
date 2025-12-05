# WeCall SMS Gateway - UI Documentation

## 📋 Project Overview

A professional SMS Gateway dashboard built with Next.js 16, TypeScript, and Tailwind CSS. The system features three distinct dashboards for different user roles: **Admin**, **Reseller**, and **Client**.

### Architecture

```
frontend/
├── app/
│   ├── page.tsx                 # Landing page with role selection
│   ├── layout.tsx               # Root layout
│   └── (dashboard)/
│       ├── layout.tsx           # Dashboard layout (sidebar + navbar)
│       ├── admin/               # Admin dashboard pages
│       │   ├── page.tsx         # Admin home
│       │   ├── sms/
│       │   ├── users/
│       │   ├── resellers/
│       │   ├── reports/
│       │   └── settings/
│       ├── reseller/            # Reseller dashboard pages
│       │   ├── page.tsx         # Reseller home
│       │   ├── sms/
│       │   ├── team/
│       │   ├── balance/
│       │   ├── reports/
│       │   └── settings/
│       └── client/              # Client dashboard pages
│           ├── page.tsx         # Client home
│           ├── sms/
│           ├── history/
│           └── account/
└── components/                  # Reusable components
    ├── Table.tsx               # Data table component
    ├── Navbar.tsx              # Top navigation bar
    ├── Sidebar.tsx             # Side navigation menu
    ├── Card.tsx                # Card wrapper
    ├── Button.tsx              # Button component
    ├── StatCard.tsx            # Statistics card
    ├── SearchBox.tsx           # Search input
    ├── Modal.tsx               # Modal dialog
    └── Pagination.tsx          # Pagination control
```

---

## 🎯 Features by Role

### 👨‍💼 Admin Dashboard
**Path:** `/admin`

**Features:**
- **Dashboard Home** - System overview with key metrics
- **SMS Management** - View all SMS messages across the system
- **User Management** - Manage all users (admins, resellers, clients)
- **Reseller Management** - Manage reseller accounts and balances
- **Reports & Analytics** - Comprehensive system reports and statistics
- **Settings** - System configuration

**Key Metrics:**
- Total SMS Sent
- Active Users
- Revenue
- Failed SMS Count
- Delivery Rate
- System Health Status

### 🏢 Reseller Dashboard
**Path:** `/reseller`

**Features:**
- **Dashboard Home** - Business metrics and quick actions
- **Send SMS** - Bulk SMS sending tool with cost estimation
- **Team Management** - Manage client accounts
- **Balance** - Account balance and transaction history
- **Reports** - Revenue and usage analytics
- **Settings** - Account configuration

**Key Metrics:**
- SMS Sent Today
- Active Clients
- Account Balance
- Monthly Revenue
- Delivery Rate
- Performance Score

### 👤 Client Dashboard
**Path:** `/client`

**Features:**
- **Dashboard Home** - Quick overview and account info
- **Send SMS** - Simple SMS sending interface
- **History** - View all sent SMS messages
- **Account** - Account settings and plan info

**Key Metrics:**
- SMS Sent
- Account Balance
- Monthly Usage %
- Failed Messages
- Plan Information

---

## 🧩 Reusable Components

### 1. **Table Component**
```tsx
<Table 
  columns={columns} 
  data={data} 
  renderRow={renderRow} 
/>
```
- Responsive data table
- Sortable columns
- Custom row rendering
- Mobile-friendly

### 2. **Card Component**
```tsx
<Card title="My Card">
  {/* Content */}
</Card>
```
- Reusable container
- Optional title
- Consistent styling
- Shadow effects

### 3. **Button Component**
```tsx
<Button 
  variant="primary" 
  size="md"
  fullWidth
>
  Click Me
</Button>
```
**Variants:** `primary`, `secondary`, `danger`, `success`
**Sizes:** `sm`, `md`, `lg`

### 4. **StatCard Component**
```tsx
<StatCard 
  icon={MessageSquare}
  label="SMS Sent"
  value="1,250"
  change={12}
  bgColor="bg-blue-100"
  iconColor="text-blue-600"
/>
```
- Display key metrics
- Trend indicators
- Icon support
- Color customization

### 5. **Navbar Component**
```tsx
<Navbar 
  userName="John Doe"
  userRole="admin"
/>
```
- Top navigation
- User info
- Notifications
- Settings access

### 6. **Sidebar Component**
```tsx
<Sidebar 
  items={menuItems}
  userRole="admin"
/>
```
- Responsive menu
- Active link highlighting
- Role-based visibility
- Icon support

### 7. **SearchBox Component**
```tsx
<SearchBox 
  placeholder="Search..."
  onSearch={handleSearch}
/>
```
- Search input with icon
- Callback support
- Customizable placeholder

### 8. **Pagination Component**
```tsx
<Pagination 
  currentPage={1}
  totalPages={10}
  onPageChange={handlePageChange}
/>
```
- Previous/Next buttons
- Page indicator
- Disabled states

### 9. **Modal Component**
```tsx
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
>
  {/* Content */}
</Modal>
```
- Overlay modal
- Close button
- Title support

---

## 🎨 Design System

### Colors
- **Primary:** `#2563eb` (Blue)
- **Success:** `#16a34a` (Green)
- **Danger:** `#dc2626` (Red)
- **Warning:** `#eab308` (Yellow)
- **Dark:** `#111827` (Gray-900)

### Spacing Scale
- xs: `0.25rem`
- sm: `0.5rem`
- md: `1rem`
- lg: `1.5rem`
- xl: `2rem`

### Typography
- **Headings:** 600 (semibold) - 700 (bold)
- **Body:** 400 (regular) - 500 (medium)
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 32px

---

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

### Navigation
- Landing page → Select role → Enter dashboard
- Each role has its own sidebar menu
- Dashboard layout remains consistent across roles

### Adding New Pages
1. Create folder in appropriate dashboard (`/admin`, `/reseller`, `/client`)
2. Create `page.tsx` file
3. Use existing components for consistency
4. Add menu item in dashboard layout

---

## 📱 Responsive Design

All components are mobile-first responsive:
- **Mobile:** 320px+
- **Tablet:** 768px+
- **Desktop:** 1024px+
- **Large Desktop:** 1280px+

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🔧 Development Tips

### Code Style
- Use TypeScript for type safety
- Use `"use client"` for client components
- Keep components under 200 lines
- Use Tailwind utilities for styling
- Extract complex logic to custom hooks

### Best Practices
1. **Reuse Components** - Use existing components instead of creating new ones
2. **Consistent Naming** - Follow established naming conventions
3. **Props Typing** - Always define component props with interfaces
4. **Error Handling** - Add proper error states for data loading
5. **Accessibility** - Use semantic HTML, labels, and ARIA attributes

### Common Patterns

**Data Table with Actions:**
```tsx
const columns = [
  { header: "Name", accessor: "name" },
  { header: "Action", accessor: "action" }
];

const renderRow = (item) => (
  <tr key={item.id}>
    <td>{item.name}</td>
    <td>
      <button onClick={() => handleEdit(item.id)}>Edit</button>
    </td>
  </tr>
);

<Table columns={columns} data={data} renderRow={renderRow} />
```

**Card with Stats:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map((stat) => (
    <StatCard key={stat.label} {...stat} />
  ))}
</div>
```

**Form with Inputs:**
```tsx
<Card title="Send SMS">
  <div className="space-y-4">
    <input 
      type="text" 
      placeholder="..."
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
</Card>
```

---

## 📦 Dependencies

### Core
- **Next.js** 16.0.6
- **React** 19.2.0
- **TypeScript** 5

### UI & Styling
- **Tailwind CSS** 4.1.17
- **Lucide React** 0.555.0 (Icons)

### State Management
- **Zustand** 5.0.9
- **React Hook Form** 7.67.0

### Utilities
- **React Query** 5.90.11
- **Zod** 4.1.13

---

## 🔐 Security Notes

### For Production:
1. Add authentication/authorization middleware
2. Implement proper error boundaries
3. Add rate limiting on API calls
4. Sanitize user inputs
5. Add CSRF protection
6. Use HTTPS
7. Implement session management
8. Add audit logging

---

## 📝 Future Enhancements

- [ ] Add real-time notifications
- [ ] Implement WebSocket for live updates
- [ ] Add data export functionality (PDF, Excel)
- [ ] Implement advanced filtering
- [ ] Add SMS scheduling
- [ ] Add template management
- [ ] Implement analytics charts
- [ ] Add API documentation
- [ ] Add dark mode
- [ ] Add multi-language support

---

## 🤝 Contributing

When adding new features:
1. Follow the established component structure
2. Use Tailwind for all styling
3. Create reusable components when possible
4. Document complex logic
5. Test on multiple screen sizes
6. Update this README

---

## 📞 Support

For questions or issues:
- Check existing components first
- Review similar pages for patterns
- Follow TypeScript strict mode
- Test all interactions

---

**Last Updated:** January 2024
**Version:** 1.0.0
