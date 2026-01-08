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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useTerms,
  useCreateTerm,
  useUpdateTerm,
  useAcademicYears,
} from "@/hooks/use-academics";
import { useToast } from "@/hooks/use-toast";

export default function Terms() {
  const { data: terms, isLoading: termsLoading } = useTerms();
  const { data: years } = useAcademicYears();
  const createMutation = useCreateTerm();
  const updateMutation = useUpdateTerm();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<any>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      academic_year_id: formData.get("academic_year_id") as string,
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
      academic_year_id: formData.get("academic_year_id") as string,
      name: formData.get("name") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      is_active: formData.get("is_active") === "on",
    };
    await updateMutation.mutateAsync({ id: editingTerm.id, ...data });
    setEditingTerm(null);
  };

  const toggleActive = async (term: any) => {
    // Deactivate all others first
    if (!term.is_active) {
      for (const t of terms || []) {
        if (t.is_active) {
          await updateMutation.mutateAsync({ id: t.id, is_active: false });
        }
      }
    }
    await updateMutation.mutateAsync({
      id: term.id,
      is_active: !term.is_active,
    });
  };

  if (termsLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Terms</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Term
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Term</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="academic_year_id">Academic Year</Label>
                <Select name="academic_year_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years?.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
        {terms?.map((term: any) => (
          <Card key={term.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <CardTitle>{term.name}</CardTitle>
                {term.is_active && <Badge>Active</Badge>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(term)}
                >
                  {term.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTerm(term)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                From {term.start_date} to {term.end_date}
              </p>
              <p className="text-sm text-muted-foreground">
                Academic Year:{" "}
                {years?.find((y: any) => y.id === term.academic_year_id)?.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingTerm} onOpenChange={() => setEditingTerm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Term</DialogTitle>
          </DialogHeader>
          {editingTerm && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="edit_academic_year_id">Academic Year</Label>
                <Select
                  name="academic_year_id"
                  defaultValue={editingTerm.academic_year_id}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years?.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_name">Name</Label>
                <Input
                  id="edit_name"
                  name="name"
                  defaultValue={editingTerm.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_start_date">Start Date</Label>
                <Input
                  id="edit_start_date"
                  name="start_date"
                  type="date"
                  defaultValue={editingTerm.start_date}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_end_date">End Date</Label>
                <Input
                  id="edit_end_date"
                  name="end_date"
                  type="date"
                  defaultValue={editingTerm.end_date}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={editingTerm.is_active}
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
