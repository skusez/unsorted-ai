"use server";
import { createClient } from "@/utils/supabase/server";

export const uploadFile = async (formData: FormData) => {
  const supabase = createClient();

  const file = formData.get("file") as File;
  const projectId = formData.get("projectId") as string;
  const userId = formData.get("userId") as string;

  if (!file || !projectId || !userId) {
    throw new Error("Missing required fields.");
  }

  try {
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
    const fileExtension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    // Get the bucket name directly from the project
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("bucket_id")
      .eq("id", projectId)
      .single();

    if (projectError) {
      console.error("Error getting project data:", projectError);
      throw new Error("Failed to get project data.");
    }

    const bucketName = projectData.bucket_id;

    // Upload file to project-specific Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error("Failed to upload file to storage.");
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    console.log({
      publicUrl,
      data,
    });

    // Add file record to the database using our custom function
    const { data: fileRecord, error: dbError } = await supabase.rpc(
      "handle_file_upload",
      {
        p_user_id: userId,
        p_project_id: projectId,
        p_file_name: fileName,
        p_file_size: file.size,
        p_file_path: publicUrl,
      }
    );

    if (dbError) {
      console.error("Database error:", dbError);
      // If there's an error, we should delete the uploaded file
      await supabase.storage.from(bucketName).remove([fileName]);
      throw new Error(
        dbError.message || "Failed to record file upload in the database."
      );
    }

    return { success: true, fileId: fileRecord };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
