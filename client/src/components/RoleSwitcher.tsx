import { useRole, type UserRole } from "@/hooks/use-role";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: "admin", label: "Admin", color: "bg-red-500" },
    { value: "head_teacher", label: "Head Teacher", color: "bg-purple-500" },
    { value: "teacher", label: "Teacher", color: "bg-blue-500" },
    { value: "bursar", label: "Bursar", color: "bg-green-500" },
    { value: "parent", label: "Parent", color: "bg-orange-500" },
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
      <span className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">View As:</span>
      <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
        <SelectTrigger className="h-8 w-[140px] border-0 bg-white shadow-sm focus:ring-0 text-xs font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${r.color}`} />
                {r.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
