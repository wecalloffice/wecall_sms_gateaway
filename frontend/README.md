# 🚀 Wecall SMS Gateway Frontend

## Overview

**Frontend** for the Wecall SMS Gateway platform—a complete SaaS solution for SMS management. Built with **Next.js 16**, **React 18**, **TypeScript**, and **Tailwind CSS**. Features comprehensive dashboards for platform admins, resellers, and clients with role-based access control, SMS management, billing, and wallet functionality.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Development

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## Features

✅ **Authentication & Authorization**
- Login/Registration with role-based dashboards
- Three user roles: PLATFORM_ADMIN, RESELLER_ADMIN, CLIENT_ADMIN
- Automatic role-based routing

✅ **Comprehensive Dashboards**
- Platform admin dashboard with metrics and controls
- Reseller dashboard for client & revenue management
- Client dashboard for SMS stats, wallet, and messaging

✅ **SMS Management**
- Send SMS campaigns
- Track message status (delivered, failed, pending)
- View message history and logs
- Filter and search capabilities

✅ **Billing & Wallet**
- Wallet balance tracking
- Top-up and payment history
- Transaction ledger
- Credit limit management

✅ **User Management**
- Contacts management for clients
- Staff/user administration
- Security settings and 2FA
- Session management

✅ **Architecture**
- Reusable component library (DashboardHeader, StatCard, RecentMessagesList, QuickActions)
- Feature-based page components (<100 lines each)
- TanStack Query for server state management
- Mock data adapters for development

---

## Tech Stack

- **Framework**: Next.js 16.0.6 with Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + custom Shadcn-style components
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **State**: React hooks + TanStack Query
- **Testing**: Jest/Vitest ready

---

## Project Structure

```
frontend/
├── app/                           # Next.js 16 app directory
│   ├── (auth)/                    # Auth layout (login, register)
│   ├── client/                    # Client pages
│   │   ├── dashboard/
│   │   ├── contacts/
│   │   ├── sms/
│   │   ├── wallet/
│   │   └── security/
│   ├── platform/                  # Platform admin pages
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── sms/
│   │   └── ...
│   ├── reseller/                  # Reseller pages
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── billing/
│   │   └── ...
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                        # Core UI components (Button, Card, Dialog, etc.)
│   └── platform/                  # Feature components
│       ├── DashboardHeader.tsx
│       ├── StatCard.tsx
│       ├── RecentMessagesList.tsx
│       └── QuickActions.tsx
│
├── features/                      # Feature page components
│   ├── client/
│   │   ├── ClientDashboardPage.tsx
│   │   ├── ClientContactsPage.tsx
│   │   ├── ClientSmsPage.tsx
│   │   ├── ClientWalletPage.tsx
│   │   └── ClientSecurityPage.tsx
│   ├── reseller/
│   │   ├── ResellerDashboardPage.tsx
│   │   ├── ResellerClientsPage.tsx
│   │   └── ResellerBillingPage.tsx
│   └── platform-dashboard/
│       └── PlatformDashboardPageRefactored.tsx
│
├── lib/
│   ├── constants.ts
│   ├── formatters.ts
│   └── auth/
│
├── mocks/                         # Mock data adapters
│   ├── adapters/
│   │   ├── authAdapter.ts
│   │   ├── accountsAdapter.ts
│   │   ├── smsAdapter.ts
│   │   ├── billingAdapter.ts
│   │   └── ...
│   └── data/
│
├── stores/                        # Zustand stores (if used)
├── providers/                     # React providers
├── public/                        # Static assets
├── README.md                      # This file
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── ...
```

---

## Available Scripts

```bash
npm run dev       # Start dev server (Turbopack, hot reload)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Core Reusable Components

**Location**: `components/platform/`

| Component | Purpose | Lines |
|-----------|---------|-------|
| `DashboardHeader` | Page title, subtitle, optional action button | 25 |
| `StatCard` | Metric display with icon, value, trend | 45 |
| `RecentMessagesList` | Last 5 messages with status indicators | 60 |
| `QuickActions` | Grid of action buttons for common tasks | 35 |

All components are under 100 lines for maintainability and reusability.

---

## Design System

- **Color Scheme**: Primary #ec008c (pink), secondary grays
- **Spacing**: Tailwind standard scale (4px base unit)
- **Typography**: System fonts (sans-serif)
- **Components**: Shadcn-style Radix UI components
- **Responsive**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA attributes, semantic HTML

---

## Role-Based Access Control

Three primary roles with dedicated dashboards:

| Role | Dashboard | Key Features |
|------|-----------|--------------|
| **PLATFORM_ADMIN** | `/platform/dashboard` | All users, global analytics, system settings |
| **RESELLER_ADMIN** | `/reseller/dashboard` | Client management, revenue tracking, billing |
| **CLIENT_ADMIN** | `/client/dashboard` | SMS sending, wallet, contacts, security |

Automatic role detection on login with redirect to appropriate dashboard.

---

## Mock Data System

For development, the app uses mock data adapters in `mocks/adapters/`:

- **authAdapter**: Login/registration simulation
- **accountsAdapter**: Client & reseller account data
- **smsAdapter**: Message history and status tracking
- **billingAdapter**: Wallet, transactions, payments
- **routingAdapter**: Route configuration
- **observabilityAdapter**: Analytics and logs

To integrate real API:
1. Replace mock adapter calls with actual HTTP requests
2. Update TanStack Query hooks with real endpoints
3. Maintain same data structure for compatibility

---

## Data Fetching

Uses **TanStack Query** for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error boundaries

Example:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['messages'],
  queryFn: () => mockSMS.getMessages('AC_CLIENT_2001')
});
```

---

## Styling & CSS

- **Tailwind CSS v4**: Utility-first CSS framework
- **Global CSS**: `app/globals.css`
- **Design Tokens**: Defined in `lib/constants.ts`
- **No CSS Modules**: Prefer Tailwind classes

---

## Type Safety

- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **Component Props**: Fully typed interfaces
- **Mock Data**: Typed interfaces matching backend contracts
- **Type Generation**: Consider adding API type generation (e.g., OpenAPI)

---

## Development Workflow

1. **Create Feature**: Add new page or feature in `/app` or `/features`
2. **Use Components**: Leverage reusable components from `components/platform/`
3. **Add Data**: Use mock adapters or real API endpoints
4. **Style**: Apply Tailwind classes
5. **Type**: Ensure all props and data are typed
6. **Test**: Run tests with `npm run test`

---

## Performance Optimization

- **Code Splitting**: Automatic with Next.js 16 app directory
- **Image Optimization**: Use `next/image` for images
- **Dynamic Imports**: Load components on demand
- **TanStack Query**: Smart caching and deduplication

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes following the project structure
3. Keep components under 100 lines
4. Use TypeScript strict mode
5. Commit: `git commit -m "feat: add my feature"`
6. Push and open a pull request

---

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Self-Hosted
```bash
npm run build
npm start
```

---

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Module not found errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build failures?**
```bash
npm run lint        # Check for type errors
npm run build       # Try building again
```

---

## License

MIT - Built with ❤️ by the WeCall team

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
