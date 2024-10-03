"use server";
import { createClient } from "@/utils/supabase/server";

export const uploadFile = async (formData: FormData) => {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;

  const file = formData.get("file") as File;
  const projectId = formData.get("projectId") as string;

  if (!user?.id) {
    throw new Error("User is not logged in.");
  }

  if (!file || !projectId) {
    throw new Error("Missing required fields.");
  }

  // Generate a unique filename
  const filePath = `${projectId}/${user.id}/${file.name}`;

  try {
    // Check if the project is active
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, status")
      .eq("id", projectId)
      .single();

    if (project?.status !== "Active") {
      console.debug("Project is not active.", project);
      throw new Error("Project is not active.");
    }

    if (projectError || !project.id) {
      throw new Error("Project does not exist.");
    }

    // Get the max file size for this project
    const { data: maxSizeData, error: maxSizeError } = await supabase.rpc(
      "get_max_file_size",
      { project_id: projectId }
    );

    if (maxSizeError) {
      console.error("Error getting max file size:", maxSizeError);
      throw new Error("Failed to get maximum file size for this project.");
    }

    const maxFileSize = maxSizeData as number;

    // Validate file size
    if (file.size > maxFileSize) {
      throw new Error(
        `File size exceeds the ${maxFileSize / (1024 * 1024)}MB limit for this subscription tier.`
      );
    }

    console.log("Uploading file:", filePath);

    // Upload file to project-specific Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from("projects")
      .upload(filePath, file);

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error("Failed to upload file to storage.");
    }

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    // delete the file from storage
    await supabase.storage.from("projects").remove([filePath]);
    throw error;
  }
};
