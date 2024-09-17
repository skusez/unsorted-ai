"use server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const uploadFile = async (formData: FormData) => {
  // TODO: This is the admin client to bypass the auth check
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;

  const file = formData.get("file") as File;
  const projectId = formData.get("projectId") as string;
  const userId = formData.get("userId") as string;

  if (userId !== user?.id) {
    throw new Error(
      "User does not have permission to upload files for this project."
    );
  }

  if (!file || !projectId || !userId) {
    throw new Error("Missing required fields.");
  }

  try {
    // Check if the project is active
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single();

    if (projectError || !project.id) {
      throw new Error("Project is not active or does not exist.");
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

    // Generate a unique filename
    const filePath = `${projectId}/${user.id}/${file.name}`;

    console.log("Uploading file:", filePath);

    // Upload file to project-specific Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from("projects")
      .upload(filePath, file);

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error("Failed to upload file to storage.");
    }

    try {
      // Add file record to the database using our custom function
      const { data: fileRecord, error: dbError } = await supabase.rpc(
        "handle_file_upload",
        {
          p_user_id: userId,
          p_project_id: projectId,
          p_file_name: file.name,
          p_file_size: file.size,
          p_file_path: filePath,
        }
      );

      if (dbError) {
        console.error("Database error:", dbError);
        // If there's an error, we should delete the uploaded file
        await supabase.storage.from("projects").remove([filePath]);
        throw new Error(
          dbError.message || "Failed to record file upload in the database."
        );
      }
    } catch (error) {
      console.error("Database error:", error);
      // If there's an error, we should delete the uploaded file
      await supabase.storage.from("projects").remove([filePath]);
    }

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
