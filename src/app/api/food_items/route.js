// src/app/api/tags/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tags = await prisma.tag.findMany();

    if (!tags || tags.length === 0) {
      return NextResponse.json({ error: "No tags found" }, { status: 200 });
    }
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch food tags", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Food tag name is required" }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name: name,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Failed to create tag", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    const tag = await prisma.tag.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Tag deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag", details: error.message }, { status: 500 });
  }
}


