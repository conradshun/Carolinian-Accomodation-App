import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!serviceItem) {
      return NextResponse.json({ error: "Service item not found" }, { status: 404 })
    }

    return NextResponse.json(serviceItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching service item:", error)
    return NextResponse.json({ error: "Failed to fetch service item", details: error.message }, { status: 500 })
  }
}

// Add DELETE functionality
export async function DELETE(req, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    // Check if the item exists first
    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id },
    })

    if (!serviceItem) {
      return NextResponse.json({ error: "Service item not found" }, { status: 404 })
    }

    // Delete the item
    await prisma.serviceItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: `Service item with ID ${id} deleted successfully` }, { status: 200 })
  } catch (error) {
    console.error("Error deleting service item:", error)
    return NextResponse.json({ error: "Failed to delete service item", details: error.message }, { status: 500 })
  }
}

