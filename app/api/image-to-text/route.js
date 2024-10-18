import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import PipelineSingleton from "./pipeline";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let tempFilePath = "";
  try {
    const formData = await request.formData();
    const image = formData.get("image");

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

    // Create a unique filename
    const uniqueId = Date.now() + Math.random().toString(36).substring(2, 15);
    tempFilePath = path.join(process.cwd(), `temp-${uniqueId}.${imageType}`);

    await fs.writeFile(tempFilePath, buffer);
    console.log("Temporary file created:", tempFilePath);

    const stats = await fs.stat(tempFilePath);
    console.log("File size:", stats.size);

    if (stats.size === 0) {
      throw new Error("Created file is empty");
    }

    // Generate caption for the image
    const classifier = await PipelineSingleton.getInstance();
    const caption = await classifier(tempFilePath);

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
        await fs.unlink(tempFilePath);
        console.log("Temporary file deleted:", tempFilePath);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    }
  }
}
