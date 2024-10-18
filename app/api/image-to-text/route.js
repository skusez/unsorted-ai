// app/api/imageToText/route.js
import { NextResponse } from "next/server";
import PipelineSingleton from "./pipeline";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json(
        { error: "No image file uploaded" },
        { status: 400 }
      );
    }

    // Save the image to a temporary file
    const tempDir = os.tmpdir();
    const imagePath = path.join(tempDir, `image-${Date.now()}.png`);
    const arrayBuffer = await image.arrayBuffer();
    await writeFile(imagePath, Buffer.from(arrayBuffer));

    // Generate caption for the image
    const classifier = await PipelineSingleton.getInstance();
    const caption = await classifier(imagePath);

    // Clean up the temporary file
    await unlink(imagePath);

    // Return the generated text
    console.log(JSON.stringify(caption));
    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
