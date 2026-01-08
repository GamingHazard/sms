import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";

type AcademicYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type Term = {
  id: string;
  academic_year_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type Attendance = {
  id: string;
  student_id: string;
  date: string;
  status: string;
};

type Exam = {
  id: string;
  name: string;
  term: string;
  year: number;
  level_id: string;
};

type Mark = {
  id: string;
  student_id: string;
  subject_id: string;
  exam_id: string;
  score: number;
};

// --- ACADEMIC YEARS ---
export function useAcademicYears() {
  return useQuery({
    queryKey: ["academic_years"],
    queryFn: async () => await mockApi.list("academic_years"),
  });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<AcademicYear, "id">) => {
      const id = `ay_${Date.now()}`;
      return await mockApi.create("academic_years", { id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic_years"] });
      toast({ title: "Success", description: "Academic year created" });
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<AcademicYear>) => {
      return await mockApi.update("academic_years", id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic_years"] });
      toast({ title: "Success", description: "Academic year updated" });
    },
  });
}

// --- TERMS ---
export function useTerms() {
  return useQuery({
    queryKey: ["terms"],
    queryFn: async () => await mockApi.list("terms"),
  });
}

export function useCreateTerm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Term, "id">) => {
      const id = `t_${Date.now()}`;
      return await mockApi.create("terms", { id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      toast({ title: "Success", description: "Term created" });
    },
  });
}

export function useUpdateTerm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Term>) => {
      return await mockApi.update("terms", id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      toast({ title: "Success", description: "Term updated" });
    },
  });
}

// --- ATTENDANCE ---
export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => await mockApi.list("attendance"),
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Attendance, "id">) => {
      const id = `a_${Date.now()}`;
      return await mockApi.create("attendance", { id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast({ title: "Success", description: "Attendance recorded" });
    },
  });
}

// --- EXAMS ---
export function useExams() {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => await mockApi.list("exams"),
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Exam, "id">) => {
      const id = `ex_${Date.now()}`;
      return await mockApi.create("exams", { id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({ title: "Success", description: "Exam created" });
    },
  });
}

// --- MARKS ---
export function useMarks() {
  return useQuery({
    queryKey: ["marks"],
    queryFn: async () => await mockApi.list("marks"),
  });
}

export function useCreateMark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Mark, "id">) => {
      const id = `m_${Date.now()}`;
      return await mockApi.create("marks", { id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      toast({ title: "Success", description: "Mark recorded" });
    },
  });
}

// Get active academic year
export function useActiveAcademicYear() {
  const { data: years } = useAcademicYears();
  return years?.find(y => y.is_active);
}

// Get active term
export function useActiveTerm() {
  const { data: terms } = useTerms();
  return terms?.find(t => t.is_active);
}
