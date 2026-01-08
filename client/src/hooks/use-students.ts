import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type InsertStudent } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";

// Fetch all students
export function useStudents() {
  return useQuery({
    queryKey: ["api.students.list.path", "v2"], // Added version to force refresh
    queryFn: async () => {
      // use mock API for client-only demo
      return await mockApi.list("students");
    },
    staleTime: 0, // Don't cache
    gcTime: 0, // Don't keep in cache
  });
}

// Fetch single student
export function useStudent(id: number) {
  return useQuery({
    queryKey: ["api.students.get.path", id],
    queryFn: async () => {
      return await mockApi.get("students", String(id));
    },
    enabled: !!id,
  });
}

// Create student
export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertStudent) => {
      // simple id generation
      const id = `s${Date.now().toString().slice(-6)}`;
      const item = { id, ...data } as any;
      return await mockApi.create("students", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api.students.list.path", "v2"] });
      toast({ title: "Success", description: "Student enrolled successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// Update student
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertStudent>) => {
      return await mockApi.update("students", String(id), updates as any);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["api.students.list.path", "v2"] });
      queryClient.invalidateQueries({ queryKey: ["api.students.get.path", variables.id] });
      toast({ title: "Success", description: "Student updated successfully" });
    },
  });
}

// Delete student
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: any) => {
      await mockApi.remove("students", String(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api.students.list.path", "v2"] });
      toast({ title: "Deleted", description: "Student record removed" });
    },
  });
}
