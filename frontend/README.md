 # 📚 Wecall SMS Gateway Frontend - README

 ## Overview

 This is the **frontend** for the Wecall SMS Gateway platform, built with Next.js, React, TypeScript, and Tailwind CSS. It provides dashboards, authentication, SMS sending, billing, and management features for platform admins, resellers, and clients.

 ---

 ## Table of Contents

 - [Features](#features)
 - [Tech Stack](#tech-stack)
 - [Project Structure](#project-structure)
 - [Getting Started](#getting-started)
 - [Available Scripts](#available-scripts)
 - [Reusable Components](#reusable-components)
 - [Design System](#design-system)
 - [Role-Based Routing](#role-based-routing)
 - [Mock Data System](#mock-data-system)
 - [Documentation](#documentation)
 - [Contributing](#contributing)
 - [License](#license)

 ---

 ## Features

 - **Landing Page**: Role selection, feature highlights
 - **Authentication**: Login, registration, role-based dashboards
 - **Dashboards**: Platform, Reseller, Client dashboards with metrics, quick actions, recent activity
 - **SMS Module**: Send SMS, view logs, status tracking
 - **Billing & Wallet**: Wallet balance, top-up, transaction history
 - **Settings & Security**: Account management, staff, security settings
 - **Reusable Component Library**: StatCard, StatusBadge, ListCard, QuickActionsCard, AlertBox
 - **Mock Data Adapters**: Simulated backend for development
 - **Responsive Design**: Mobile-friendly layouts

 ---

 ## Tech Stack

 - **Framework**: Next.js 16.x
 - **Language**: TypeScript (strict mode)
 - **UI**: React 18+, Tailwind CSS v4
 - **Icons**: Lucide React
 - **UI Primitives**: Radix UI
 - **State/Data**: React Query
 - **Testing**: (Add your preferred testing library)

 ---

 ## Project Structure

 ```
 frontend/
 ├── app/                # Next.js app directory
 │   ├── (auth)/         # Auth pages (login, register)
 │   ├── client/         # Client dashboard/pages
 │   ├── platform/       # Platform admin dashboard/pages
 │   ├── reseller/       # Reseller dashboard/pages
 │   └── ...
 ├── components/
 │   └── ui/             # Reusable UI components
 ├── features/
 │   └── auth/           # Auth logic, hooks, API
 ├── lib/
 │   ├── formatters.ts   # Data formatting utilities
 │   ├── constants/      # Design tokens, status colors
 │   └── auth/           # Role-based routing utilities
 ├── mocks/              # Mock data adapters
 ├── public/             # Static assets
 ├── styles/             # Global CSS
 ├── README.md           # This file
 ├── START_HERE.md       # Master implementation guide
 └── ...
 ```

 ---

 ## Getting Started

 ### Prerequisites
 - Node.js 18+
 - npm 9+

 ### Installation

 ```powershell
 cd frontend
 npm install
 ```

 ### Running Locally

 ```powershell
 npm run dev
 ```

 App will be available at `http://localhost:3000`

 ---

 ## Available Scripts

 - `npm run dev` - Start development server
 - `npm run build` - Build for production
 - `npm run lint` - Run ESLint
 - `npm run format` - Format code with Prettier
 - `npm run test` - Run tests (if configured)

 ---

 ## Reusable Components

 All major UI patterns are extracted as reusable components in `components/ui/`:

 - **StatCard**: Metric display card
 - **StatusBadge**: Status indicator with auto color
 - **ListCard**: Generic list container
 - **QuickActionsCard**: Navigation/action buttons
 - **AlertBox**: Error/success/warning/info alerts

 See `VISUAL_REFERENCE.md` for visual examples and API docs.

 ---

 ## Design System

 - **Tailwind CSS**: Utility-first styling
 - **Design Tokens**: Centralized in `lib/constants/statusColors.ts`
 - **Light Theme Only**: No dark mode
 - **Consistent Buttons**: `.btn-primary`, `.btn-primary-outline`

 ---

 ## Role-Based Routing

 - **Roles**: PLATFORM_ADMIN, RESELLER_ADMIN, CLIENT_ADMIN
 - **Utilities**: `lib/auth/roleBasedRouting.ts` for route management
 - **Automatic Routing**: Auth hooks redirect users to correct dashboard

 ---

 ## Mock Data System

 - **Adapters**: `mocks/` directory
 - **Modules**: Accounts, SMS, Billing, Observability, Routing, Staff
 - **Purpose**: Simulate backend for development and testing

 ---

 ## Documentation

 - `START_HERE.md`: Master guide
 - `COMPONENT_IMPLEMENTATION_GUIDE.md`: Step-by-step usage
 - `REUSABLE_COMPONENTS.md`: Analysis and roadmap
 - `REUSABLE_COMPONENTS_SUMMARY.md`: Quick reference
 - `VISUAL_REFERENCE.md`: Visual examples
 - `EXAMPLE_REFACTORED_DASHBOARD.tsx`: Before/after code

 ---

 ## Contributing

 1. Fork the repo
 2. Create a feature branch
 3. Commit your changes
 4. Open a pull request

 **Coding Standards:**
 - Use TypeScript strict mode
 - Prefer reusable components
 - Follow Tailwind CSS conventions
 - Document new components in `COMPONENT_IMPLEMENTATION_GUIDE.md`

 ---

 ## License

 MIT

 ---

 ## Contact

 For questions or support, contact the Wecall SMS Gateway team at support@wecalloffice.com

 ---

 **Happy coding!** 🚀
