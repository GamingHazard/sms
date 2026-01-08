import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  Menu,
  X,
  Bell,
  Search,
  School,
  FileText,
  Settings,
} from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";
import { useRole } from "@/hooks/use-role";
import { useActiveAcademicYear, useActiveTerm } from "@/hooks/use-academics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const {
    role,
    canViewFinance,
    canViewStudents,
    canViewAcademics,
    canViewAttendance,
    canViewReports,
    canViewSettings,
    canViewDashboard,
  } = useRole();
  const activeYear = useActiveAcademicYear();
  const activeTerm = useActiveTerm();

  const navigation = [
    ...(canViewDashboard
      ? [{ name: "Dashboard", href: "/", icon: LayoutDashboard }]
      : []),
    ...(canViewStudents
      ? [{ name: "Students", href: "/students", icon: Users }]
      : []),
    ...(canViewAcademics
      ? [{ name: "Academics", href: "/academics", icon: GraduationCap }]
      : []),
    ...(canViewAttendance
      ? [{ name: "Attendance", href: "/attendance", icon: CalendarCheck }]
      : []),
    ...(canViewFinance
      ? [{ name: "Fees & Finance", href: "/fees", icon: Wallet }]
      : []),
    ...(canViewReports
      ? [{ name: "Reports", href: "/reports", icon: FileText }]
      : []),
    ...(canViewSettings
      ? [{ name: "Settings", href: "/settings", icon: Settings }]
      : []),
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <School size={24} />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">
              Bright Future
            </h1>
            <p className="text-xs text-muted-foreground">School System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
              flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
              ${
                isActive(item.href)
                  ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
            >
              <item.icon
                size={18}
                strokeWidth={isActive(item.href) ? 2.5 : 2}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9 border border-white shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">
                  {role.replace("_", " ").toUpperCase()}
                </p>
              </div>
            </div>
            <RoleSwitcher />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 w-64 border border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
              <span>
                Active: {activeYear?.name || "No Year"} |{" "}
                {activeTerm?.name || "No Term"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:text-primary"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-300 md:hidden
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <span className="font-display font-bold text-lg">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
              flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl
              ${
                isActive(item.href) ? "bg-primary text-white" : "text-slate-600"
              }
            `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <RoleSwitcher />
          </div>
        </nav>
      </div>
    </div>
  );
}
