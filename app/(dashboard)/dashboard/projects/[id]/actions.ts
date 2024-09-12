"use server";
import { createClient } from "@/utils/supabase/server";

export const getProject = async (id: string) => {
  const supabase = createClient();
  return await supabase.from("projects").select().eq("id", id).single();
};

// Fetch user score for a specific project
export const getUserScore = async (userId: string, projectId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_project_files")
    .select("contribution_score")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (error) {
    console.error("Error fetching user score:", error);
    return null;
  }

  return data?.contribution_score;
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
