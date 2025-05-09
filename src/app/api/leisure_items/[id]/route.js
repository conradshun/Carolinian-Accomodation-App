import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { id } = params

    const leisureItem = await prisma.leisureItem.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!leisureItem) {
      return NextResponse.json({ error: "Leisure item not found" }, { status: 404 })
    }

    // Convert the byte array to a regular JavaScript array
    if (leisureItem.image) {
      leisureItem.image = Array.from(leisureItem.image)
    }

    // Transform the tags array to a more usable format
    const transformedLeisureItem = {
      ...leisureItem,
      tags: leisureItem.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
      })),
    }

    return NextResponse.json(transformedLeisureItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure item:", error)
    return NextResponse.json({ error: "Failed to fetch leisure item", details: error.message }, { status: 500 })
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
    const leisureItem = await prisma.leisureItem.findUnique({
      where: { id: idInt },
    })

    if (!leisureItem) {
      return NextResponse.json({ error: "Leisure item not found" }, { status: 404 })
    }

    // Delete the item
    await prisma.leisureItem.delete({
      where: { id: idInt },
    })

    return NextResponse.json({ message: `Leisure item with ID ${idInt} deleted successfully` }, { status: 200 })
  } catch (error) {
    console.error("Error deleting leisure item:", error)
    return NextResponse.json({ error: "Failed to delete leisure item", details: error.message }, { status: 500 })
  }
}
