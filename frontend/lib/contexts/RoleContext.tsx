'use client';

import { createContext, useContext, ReactNode } from 'react';

type Role = 'PLATFORM' | 'RESELLER' | 'CLIENT';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children, initialRole = 'CLIENT' }: { children: ReactNode; initialRole?: Role }) {
  const [role, setRole] = React.useState<Role>(initialRole);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
