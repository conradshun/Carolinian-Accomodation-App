import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();



export async function GET(req, context) {
  try {
    const { params } = context;
    const { id } = params;

    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!serviceItem) {
      return NextResponse.json({ error: "Service item not found" }, { status: 404 });
    }

    // Convert the byte array to a regular JavaScript array
    if (serviceItem.image) {
      serviceItem.image = Array.from(serviceItem.image);
    }

    return NextResponse.json(serviceItem, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service item" }, { status: 500 });
  }
}

// Add DELETE functionality
export async function DELETE(req) {
  try {
    // Get the ID from the URL search params
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const idInt = Number.parseInt(id)

    if (isNaN(idInt)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    // Check if the item exists first
    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id: idInt },
    })

    if (!serviceItem) {
      return NextResponse.json({ error: "Service item not found" }, { status: 404 })
    }

    // Delete the item
    await prisma.serviceItem.delete({
      where: { id: idInt },
    })

    return NextResponse.json({ message: `Service item with ID ${idInt} deleted successfully` }, { status: 200 })
  } catch (error) {
    console.error("Error deleting service item:", error)
    return NextResponse.json({ error: "Failed to delete service item", details: error.message }, { status: 500 })
  }
}

