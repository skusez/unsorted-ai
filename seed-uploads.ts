// a seed script to upload some files to supabase storage
import { createAdminClient } from "@/utils/supabase/admin";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({
  path: ".env.local",
});
const supabase = createAdminClient();

const uploadFile = async (filePath: string, file: File) => {
  const { data, error } = await supabase.storage
    .from("projects")
    .upload(filePath, file);
  if (error) throw error;
};

const main = async () => {
  // get projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*");
  if (projectsError) throw projectsError;

  // get the files from seed-files directory
  const files = fs.readdirSync("./seed-files");

  // get a random user id
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);
  if (usersError) throw usersError;
  const userId = users[0].id;

  // for each project, upload the files to the project's storage
  for (const project of projects) {
    for (const file of files) {
      console.log(`Uploading file ${file} to project ${project.id}`);
      const fileBuffer = fs.readFileSync(`./seed-files/${file}`);
      const fileBlob = new Blob([fileBuffer], {
        type: "application/octet-stream",
      });
      const fileFile = new File([fileBlob], file, {
        type: "application/octet-stream",
      });

      await uploadFile(`${project.id}/${userId}/${file}`, fileFile);
    }
  }
};

main()
  .then(() => {
    console.log("Files uploaded");
  })
  .catch((error) => {
    console.error(error);
  });
