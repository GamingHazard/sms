import { createContext, useContext, useState, ReactNode } from "react";

// Simplified client-side role management for demo purposes
export type UserRole =
  | "admin"
  | "head_teacher"
  | "teacher"
  | "bursar"
  | "parent";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  canEdit: boolean;
  canViewFinance: boolean;
  canViewStudents: boolean;
  canViewAcademics: boolean;
  canViewAttendance: boolean;
  canViewReports: boolean;
  canViewSettings: boolean;
  canViewDashboard: boolean;
  permissions: {
    students: { view: boolean; edit: boolean };
    fees: { view: boolean; edit: boolean };
    attendance: { view: boolean; edit: boolean };
    reports: { view: boolean; edit: boolean };
    settings: { view: boolean; edit: boolean };
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");

  const getPermissions = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          students: { view: true, edit: true },
          fees: { view: true, edit: true },
          attendance: { view: true, edit: true },
          reports: { view: true, edit: true },
          settings: { view: true, edit: true },
        };
      case "head_teacher":
        return {
          students: { view: true, edit: true },
          fees: { view: true, edit: false },
          attendance: { view: true, edit: true },
          reports: { view: true, edit: true },
          settings: { view: true, edit: false },
        };
      case "teacher":
        return {
          students: { view: true, edit: false },
          fees: { view: false, edit: false },
          attendance: { view: true, edit: true },
          reports: { view: true, edit: false },
          settings: { view: false, edit: false },
        };
      case "bursar":
        return {
          students: { view: true, edit: false },
          fees: { view: true, edit: true },
          attendance: { view: false, edit: false },
          reports: { view: true, edit: false },
          settings: { view: false, edit: false },
        };
      case "parent":
        return {
          students: { view: true, edit: false },
          fees: { view: true, edit: false },
          attendance: { view: true, edit: false },
          reports: { view: true, edit: false },
          settings: { view: false, edit: false },
        };
      default:
        return {
          students: { view: false, edit: false },
          fees: { view: false, edit: false },
          attendance: { view: false, edit: false },
          reports: { view: false, edit: false },
          settings: { view: false, edit: false },
        };
    }
  };

  const permissions = getPermissions(role);
  const canEdit = ["admin", "head_teacher", "teacher"].includes(role);
  const canViewFinance = ["admin", "head_teacher", "bursar"].includes(role);
  const canViewStudents = permissions.students.view;
  const canViewAcademics = ["admin", "head_teacher", "teacher"].includes(role);
  const canViewAttendance = permissions.attendance.view;
  const canViewReports = permissions.reports.view;
  const canViewSettings = permissions.settings.view;
  const canViewDashboard = ["admin", "head_teacher", "bursar"].includes(role);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        canEdit,
        canViewFinance,
        canViewStudents,
        canViewAcademics,
        canViewAttendance,
        canViewReports,
        canViewSettings,
        canViewDashboard,
        permissions,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
