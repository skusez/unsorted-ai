import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import PipelineSingleton from "./pipeline";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;
export async function POST(request) {
  let tempFilePath = "";
  const supabase = createAdminClient();
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const user_id = formData.get("user_id");
    const project_id = formData.get("project_id");

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "No valid image data provided" },
        { status: 400 }
      );
    }

    // Check if the image data is a valid data URL
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image data format" },
        { status: 400 }
      );
    }

    // Extract the base64 data and image type from the data URL
    const matches = image.match(/^data:image\/(\w+);base64,(.*)$/);
    if (!matches) {
      return NextResponse.json(
        { error: "Unable to parse image data" },
        { status: 400 }
      );
    }

    const imageType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const blob = new Blob([buffer], { type: `image/${imageType}` });

    // Create a unique filename
    const uniqueId = Date.now() + Math.random().toString(36).substring(2, 15);
    const { data } = await supabase.storage
      .from("tmp")
      .upload(`${project_id}/${user_id}/temp-${uniqueId}.${imageType}`, blob);
    tempFilePath = data.path;
    // Generate caption for the image
    console.log(
      "data",
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tmp/${tempFilePath}`
    );
    const classifier = await PipelineSingleton.getInstance();
    const caption = await classifier(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tmp/${tempFilePath}`
    );

    // Return the generated text along with the label
    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  } finally {
    // Clean up: remove the temporary file
    if (tempFilePath) {
      try {
        supabase.storage.from("tmp").remove(tempFilePath);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    }
  }
}
