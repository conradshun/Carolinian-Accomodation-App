import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { id } = params

    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id: Number.parseInt(id) },
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

    // Create a processed copy of the item to avoid mutating the original
    const processedItem = { ...serviceItem }

    // Convert the byte array to a regular JavaScript array
    if (processedItem.image) {
      processedItem.image = Array.from(processedItem.image)
    }

    // Transform the tags array to a more usable format
    processedItem.tags = serviceItem.tags.map((tagRelation) => ({
      id: tagRelation.tag.id,
      name: tagRelation.tag.name,
    }))

    return NextResponse.json(processedItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching service item:", error)
    return NextResponse.json({ error: "Failed to fetch service item", details: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params

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
