import { createContext, useContext, useState, ReactNode } from 'react';

// Simplified client-side role management for demo purposes
export type UserRole = 'admin' | 'head_teacher' | 'teacher' | 'bursar' | 'parent';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  canEdit: boolean;
  canViewFinance: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');

  const canEdit = ['admin', 'head_teacher', 'teacher'].includes(role);
  const canViewFinance = ['admin', 'head_teacher', 'bursar'].includes(role);

  return (
    <RoleContext.Provider value={{ role, setRole, canEdit, canViewFinance }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
