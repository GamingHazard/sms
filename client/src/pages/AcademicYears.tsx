import { useState } from "react";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from "@/hooks/use-academics";
import { useToast } from "@/hooks/use-toast";

export default function AcademicYears() {
  const { data: years, isLoading } = useAcademicYears();
  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<any>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      is_active: false,
    };
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      is_active: formData.get("is_active") === "on",
    };
    await updateMutation.mutateAsync({ id: editingYear.id, ...data });
    setEditingYear(null);
  };

  const toggleActive = async (year: any) => {
    // Deactivate all others first
    if (!year.is_active) {
      for (const y of years || []) {
        if (y.is_active) {
          await updateMutation.mutateAsync({ id: y.id, is_active: false });
        }
      }
    }
    await updateMutation.mutateAsync({
      id: year.id,
      is_active: !year.is_active,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Academic Years</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Academic Year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Academic Year</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" name="end_date" type="date" required />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {years?.map((year: any) => (
          <Card key={year.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <CardTitle>{year.name}</CardTitle>
                {year.is_active && <Badge>Active</Badge>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(year)}
                >
                  {year.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingYear(year)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                From {year.start_date} to {year.end_date}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingYear} onOpenChange={() => setEditingYear(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Academic Year</DialogTitle>
          </DialogHeader>
          {editingYear && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="edit_name">Name</Label>
                <Input
                  id="edit_name"
                  name="name"
                  defaultValue={editingYear.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_start_date">Start Date</Label>
                <Input
                  id="edit_start_date"
                  name="start_date"
                  type="date"
                  defaultValue={editingYear.start_date}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_end_date">End Date</Label>
                <Input
                  id="edit_end_date"
                  name="end_date"
                  type="date"
                  defaultValue={editingYear.end_date}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={editingYear.is_active}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button type="submit">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
