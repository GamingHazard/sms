import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRole } from "@/hooks/use-role";

export default function Permissions() {
  const { permissions, setRole } = useRole();
  const [localPermissions, setLocalPermissions] = useState(permissions);

  const features = [
    { key: "students", name: "Students" },
    { key: "fees", name: "Fees" },
    { key: "attendance", name: "Attendance" },
    { key: "reports", name: "Reports" },
    { key: "settings", name: "Settings" },
  ];

  const roles = [
    { key: "admin", name: "Admin" },
    { key: "head_teacher", name: "Head Teacher" },
    { key: "teacher", name: "Teacher" },
    { key: "bursar", name: "Bursar" },
    { key: "parent", name: "Parent" },
  ];

  const handlePermissionChange = (
    role: string,
    feature: string,
    type: "view" | "edit",
    value: boolean
  ) => {
    // In a real app, this would update the backend
    // For demo, just update local state
    setLocalPermissions((prev) => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [type]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Permissions Matrix</h1>
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  {roles.map((role) => (
                    <th
                      key={role.key}
                      className="text-center p-2 min-w-[120px]"
                    >
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key} className="border-b">
                    <td className="p-2 font-medium">{feature.name}</td>
                    {roles.map((role) => (
                      <td key={role.key} className="p-2 text-center">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`${role.key}-${feature.key}-view`}
                              checked={
                                localPermissions[feature.key]?.view || false
                              }
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  role.key,
                                  feature.key,
                                  "view",
                                  checked
                                )
                              }
                            />
                            <Label
                              htmlFor={`${role.key}-${feature.key}-view`}
                              className="text-xs"
                            >
                              View
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`${role.key}-${feature.key}-edit`}
                              checked={
                                localPermissions[feature.key]?.edit || false
                              }
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  role.key,
                                  feature.key,
                                  "edit",
                                  checked
                                )
                              }
                            />
                            <Label
                              htmlFor={`${role.key}-${feature.key}-edit`}
                              className="text-xs"
                            >
                              Edit
                            </Label>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
