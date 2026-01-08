import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertAttendance, type InsertExam, type InsertMark } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// --- ATTENDANCE ---
export function useAttendance() {
  return useQuery({
    queryKey: [api.attendance.list.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return api.attendance.list.responses[200].parse(await res.json());
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertAttendance) => {
      const res = await fetch(api.attendance.mark.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark attendance");
      return api.attendance.mark.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attendance.list.path] });
      toast({ title: "Success", description: "Attendance recorded" });
    },
  });
}

// --- EXAMS ---
export function useExams() {
  return useQuery({
    queryKey: [api.exams.list.path],
    queryFn: async () => {
      const res = await fetch(api.exams.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch exams");
      return api.exams.list.responses[200].parse(await res.json());
    },
  });
}

// --- MARKS ---
export function useMarks() {
  return useQuery({
    queryKey: [api.marks.list.path],
    queryFn: async () => {
      const res = await fetch(api.marks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch marks");
      return api.marks.list.responses[200].parse(await res.json());
    },
  });
}

export function useRecordMark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertMark) => {
      const res = await fetch(api.marks.record.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to record mark");
      return api.marks.record.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.marks.list.path] });
      toast({ title: "Success", description: "Mark recorded" });
    },
  });
}
