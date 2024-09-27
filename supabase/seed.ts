// this is a script to seed the database with the drawings from ../seed-files/
import { createAdminClient } from "@/utils/supabase/admin";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: ".env.local",
});

const seedFilesPath = path.join(__dirname, "./seed-files");

async function seed() {
  const supabase = createAdminClient();
  //   get all projects
  const { data, error } = await supabase.from("projects").select("*");

  // get a sample user
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();
  if (userError || !userData) throw userError;

  // loop through each project
  for (const project of data || []) {
    // loop through each drawing at ./drawings/
    const drawings = fs.readdirSync(seedFilesPath);
    let drawingPaths = [];
    for (const drawing of drawings) {
      const drawingBuffer = fs.readFileSync(path.join(seedFilesPath, drawing));
      // convert the to a file
      const drawingFile = new File([drawingBuffer], drawing, {
        type: "image/png",
      });

      // upload the drawing to project/user/drawing
      const { data, error } = await supabase.storage
        .from("projects")
        .upload(`${project.id}/${userData.id}/${drawing}`, drawingFile, {
          upsert: true,
          metadata: {
            user_id: userData.id,
            project_id: project.id,
          },
        });
      if (error || !data.fullPath) throw error;
      drawingPaths.push(data.fullPath);
    }

    // set the projects status to training
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .update({ status: "Training" })
      .eq("id", project.id);
    if (projectError) throw projectError;
  }

  console.log("Seeded");
}

seed();
