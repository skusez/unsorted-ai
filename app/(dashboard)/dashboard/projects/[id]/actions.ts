"use server";
import { createClient } from "@/utils/supabase/server";

export const getProject = async (id: string) => {
  const supabase = createClient();
  return (await supabase.from("projects").select().eq("id", id).single()).data;
};

// Fetch user score for a specific project
export const getUserScore = async (projectId: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id as string;
  if (!userId) {
    console.error("No user session found");
    return null;
  }

  const { data, error } = await supabase
    .from("user_project_scores")
    .select("total_score")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (error) {
    console.error("Error fetching user score:", error);
    return null;
  }
  return data?.total_score ?? 0;
};

// Fetch project files
export const getProjectFiles = async (projectId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching project files:", error);
    return [];
  }

  return data;
};
