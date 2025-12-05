# 🎨 WeCall SMS Gateway - Components Cheatsheet

## Quick Reference for All Reusable Components

---

## 1️⃣ Table Component

**File:** `components/Table.tsx`
**Purpose:** Display tabular data with customizable columns and rows

### Basic Usage
```tsx
import Table from "@/components/Table";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
];

const data = [
  { id: 1, name: "John", email: "john@example.com", status: "Active" },
  { id: 2, name: "Jane", email: "jane@example.com", status: "Active" },
];

const renderRow = (item) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-gray-50 text-sm">
    <td className="p-4">{item.name}</td>
    <td className="p-4">{item.email}</td>
    <td className="hidden md:table-cell p-4">
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
        {item.status}
      </span>
    </td>
  </tr>
);

<Table columns={columns} data={data} renderRow={renderRow} />
```

### Props
```tsx
interface TableProps {
  columns: Column[];           // Column definitions
  data: any[];                 // Array of data
  renderRow: (item: any) => React.ReactNode;  // Custom row rendering
}

interface Column {
  header: string;              // Column header text
  accessor: string;            // Data property name
  className?: string;          // Optional CSS classes
}
```

---

## 2️⃣ Card Component

**File:** `components/Card.tsx`
**Purpose:** Reusable container for content with consistent styling

### Basic Usage
```tsx
import Card from "@/components/Card";

{/* Simple card */}
<Card>
  <p>Simple content</p>
</Card>

{/* Card with title */}
<Card title="My Section">
  <div className="space-y-4">
    <p>Content goes here</p>
    <button>Action</button>
  </div>
</Card>

{/* Card with custom className */}
<Card title="Special Card" className="shadow-lg">
  {/* Content */}
</Card>
```

### Props
```tsx
interface CardProps {
  children: React.ReactNode;   // Card content
  title?: string;              // Optional title
  className?: string;          // Optional additional classes
}
```

### Common Patterns
```tsx
{/* Grid of cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card title="Card 1"><p>Content</p></Card>
  <Card title="Card 2"><p>Content</p></Card>
  <Card title="Card 3"><p>Content</p></Card>
</div>
```

---

## 3️⃣ Button Component

**File:** `components/Button.tsx`
**Purpose:** Consistent button styling with multiple variants

### Basic Usage
```tsx
import Button from "@/components/Button";

{/* Primary button */}
<Button variant="primary">Click Me</Button>

{/* Secondary button */}
<Button variant="secondary">Cancel</Button>

{/* Danger button */}
<Button variant="danger">Delete</Button>

{/* Success button */}
<Button variant="success">Confirm</Button>

{/* Different sizes */}
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

{/* Full width */}
<Button fullWidth>Full Width Button</Button>

{/* With icon */}
<Button variant="primary">
  <Send size={16} className="mr-2 inline" />
  Send SMS
</Button>

{/* Disabled */}
<Button disabled>Disabled Button</Button>
```

### Props
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";  // Default: "primary"
  size?: "sm" | "md" | "lg";                                  // Default: "md"
  children: React.ReactNode;
  fullWidth?: boolean;
  // Plus all standard HTML button attributes
}
```

### All Combinations
```tsx
{/* Primary */}
<Button variant="primary">Primary</Button>
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" fullWidth>Full Width</Button>

{/* Secondary */}
<Button variant="secondary">Secondary</Button>

{/* Danger */}
<Button variant="danger">Delete</Button>

{/* Success */}
<Button variant="success">Confirm</Button>
```

---

## 4️⃣ StatCard Component

**File:** `components/StatCard.tsx`
**Purpose:** Display key statistics with icons and trends

### Basic Usage
```tsx
import StatCard from "@/components/StatCard";
import { MessageSquare, Users, TrendingUp, CreditCard } from "lucide-react";

{/* Single stat card */}
<StatCard 
  icon={MessageSquare}
  label="SMS Sent"
  value="1,250"
  change={12}
  bgColor="bg-blue-100"
  iconColor="text-blue-600"
/>

{/* Grid of stat cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard 
    icon={MessageSquare}
    label="SMS Sent"
    value="124,563"
    change={12}
    bgColor="bg-blue-100"
    iconColor="text-blue-600"
  />
  <StatCard 
    icon={Users}
    label="Active Users"
    value="1,243"
    change={8}
    bgColor="bg-green-100"
    iconColor="text-green-600"
  />
  <StatCard 
    icon={TrendingUp}
    label="Revenue"
    value="$45,230"
    change={15}
    bgColor="bg-purple-100"
    iconColor="text-purple-600"
  />
  <StatCard 
    icon={CreditCard}
    label="Balance"
    value="$5,234.50"
    change={5}
    bgColor="bg-orange-100"
    iconColor="text-orange-600"
  />
</div>
```

### Props
```tsx
interface StatCardProps {
  icon: LucideIcon;            // Icon from lucide-react
  label: string;               // Stat label
  value: string | number;      // Stat value
  change?: number;             // Percentage change (positive/negative)
  bgColor?: string;            // Tailwind bg color for icon
  iconColor?: string;          // Tailwind text color for icon
}
```

---

## 5️⃣ Navbar Component

**File:** `components/Navbar.tsx`
**Purpose:** Top navigation bar with user info

### Basic Usage
```tsx
import Navbar from "@/components/Navbar";

<Navbar 
  userName="John Doe"
  userEmail="john@example.com"
  userRole="admin"
/>
```

### Props
```tsx
interface NavbarProps {
  userName?: string;           // User name
  userEmail?: string;          // User email
  userRole?: string;           // User role (admin, reseller, client)
}
```

---

## 6️⃣ Sidebar Component

**File:** `components/Sidebar.tsx`
**Purpose:** Side navigation menu

### Basic Usage
```tsx
import Sidebar from "@/components/Sidebar";

const menu = [
  { label: "Home", href: "/admin", icon: <Home size={20} /> },
  { label: "SMS", href: "/admin/sms", icon: <MessageSquare size={20} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={20} /> },
];

<Sidebar title="Admin Panel" menu={menu} />
```

### Props
```tsx
interface SidebarProps {
  title?: string;              // Sidebar title
  menu: MenuItem[];            // Menu items
}

interface MenuItem {
  label: string;               // Item label
  href: string;                // Link href
  icon?: React.ReactNode;      // Icon component
}
```

---

## 7️⃣ SearchBox Component

**File:** `components/SearchBox.tsx`
**Purpose:** Search input with icon

### Basic Usage
```tsx
import SearchBox from "@/components/SearchBox";
import { useState } from "react";

const [searchTerm, setSearchTerm] = useState("");

<SearchBox 
  placeholder="Search users..."
  onSearch={(value) => setSearchTerm(value)}
/>
```

### Props
```tsx
interface SearchBoxProps {
  placeholder?: string;                 // Input placeholder
  onSearch?: (value: string) => void;  // Callback when typing
}
```

---

## 8️⃣ Pagination Component

**File:** `components/Pagination.tsx`
**Purpose:** Page navigation controls

### Basic Usage
```tsx
import Pagination from "@/components/Pagination";
import { useState } from "react";

const [currentPage, setCurrentPage] = useState(1);

<Pagination 
  currentPage={currentPage}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

### Props
```tsx
interface PaginationProps {
  currentPage: number;                          // Current page number
  totalPages: number;                           // Total number of pages
  onPageChange: (page: number) => void;        // Page change callback
}
```

---

## 9️⃣ Modal Component

**File:** `components/Modal.tsx`
**Purpose:** Dialog/popup for confirmations or forms

### Basic Usage
```tsx
import Modal from "@/components/Modal";
import { useState } from "react";

const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
>
  <div>
    <p className="mb-6">Are you sure you want to delete this item?</p>
    <div className="flex gap-4">
      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded">
        Delete
      </button>
      <button 
        className="flex-1 px-4 py-2 bg-gray-200 rounded"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

<button onClick={() => setIsOpen(true)}>
  Open Modal
</button>
```

### Props
```tsx
interface ModalProps {
  isOpen: boolean;              // Is modal visible?
  onClose: () => void;          // Close callback
  title: string;                // Modal title
  children: React.ReactNode;    // Modal content
}
```

---

## 📦 All Imports

```tsx
// Components
import Table from "@/components/Table";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatCard from "@/components/StatCard";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SearchBox from "@/components/SearchBox";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";

// Icons (from lucide-react)
import {
  Home,
  MessageSquare,
  Users,
  Settings,
  TrendingUp,
  CreditCard,
  Eye,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Plus,
  Download,
  Bell,
  LogOut,
  Filter,
  BarChart3,
  AlertCircle,
  Lock,
  Zap,
  Shield,
} from "lucide-react";
```

---

## 🎨 Tailwind Color Classes

```tsx
{/* Background colors */}
bg-blue-50 to bg-blue-900
bg-green-50 to bg-green-900
bg-red-50 to bg-red-900
bg-purple-50 to bg-purple-900
bg-gray-50 to bg-gray-900

{/* Text colors */}
text-blue-600, text-green-600, text-red-600, etc.

{/* Border colors */}
border-gray-200, border-blue-600, etc.

{/* Common combinations */}
bg-blue-100 + text-blue-700        // Light blue background
bg-green-100 + text-green-700      // Light green background
bg-red-100 + text-red-700          // Light red background
```

---

## 🔄 Common Patterns

### Modal with Form
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Send SMS">
  <form onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }}>
    <input type="text" placeholder="Recipients" className="w-full mb-4 p-2 border rounded" />
    <textarea placeholder="Message" className="w-full mb-4 p-2 border rounded" rows={4} />
    <div className="flex gap-4">
      <Button type="submit" variant="primary" fullWidth>Send</Button>
      <Button type="button" variant="secondary" fullWidth onClick={() => setIsOpen(false)}>Cancel</Button>
    </div>
  </form>
</Modal>
```

### Data Table with Actions
```tsx
const renderRow = (item) => (
  <tr key={item.id} className="border-b">
    <td className="p-4">{item.name}</td>
    <td className="p-4 flex gap-2">
      <button className="p-2 hover:bg-blue-100 rounded text-blue-600">
        <Edit2 size={16} />
      </button>
      <button className="p-2 hover:bg-red-100 rounded text-red-600">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);
```

### Stats Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map((stat) => (
    <StatCard key={stat.label} {...stat} />
  ))}
</div>
```

---

## ✅ Quick Checklist

When creating a new page:
- [ ] Import necessary components
- [ ] Create mock data or fetch from API
- [ ] Add page header (h1 + description)
- [ ] Display statistics (StatCard grid)
- [ ] Add filters/search (SearchBox)
- [ ] Display data (Table component)
- [ ] Test on mobile, tablet, desktop
- [ ] Use Tailwind for all styling
- [ ] Follow existing patterns

---

**Version:** 1.0.0
**Last Updated:** January 2024
