import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertNotice } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useNotices() {
  return useQuery({
    queryKey: [api.notices.list.path],
    queryFn: async () => {
      const res = await fetch(api.notices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notices");
      return api.notices.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNotice) => {
      const res = await fetch(api.notices.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create notice");
      return api.notices.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notices.list.path] });
      toast({ title: "Success", description: "Notice published" });
    },
  });
}
