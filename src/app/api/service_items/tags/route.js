import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    let name;

    // Inspect the Content-Type header
    const contentType = req.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // Parse as JSON
      const jsonData = await req.json();
      name = jsonData.name;
    } else if (contentType && contentType.includes("multipart/form-data")) {
      // Parse as FormData
      const formData = await req.formData();
      name = formData.get("name");
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: name,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag", details: error.message },
      { status: 500 }
    );
  }
}


