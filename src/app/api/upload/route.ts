import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "File must be an image (JPEG, PNG, WEBP, GIF)" }, { status: 400 });
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "Image size must be under 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      url: base64Image,
    });
  } catch (error) {
    console.error("Direct Image Upload Error:", error);
    return NextResponse.json({ message: "Server error processing image upload" }, { status: 500 });
  }
}
