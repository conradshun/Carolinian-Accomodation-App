import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const leisureItem = await prisma.leisureItem.findUnique({
      where: { id },
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

    return NextResponse.json(leisureItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure item:", error)
    return NextResponse.json({ error: "Failed to fetch leisure item", details: error.message }, { status: 500 })
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
    const leisureItem = await prisma.leisureItem.findUnique({
      where: { id },
    })

    if (!leisureItem) {
      return NextResponse.json({ error: "Leisure item not found" }, { status: 404 })
    }

    // Delete the item
    await prisma.leisureItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: `Leisure item with ID ${id} deleted successfully` }, { status: 200 })
  } catch (error) {
    console.error("Error deleting leisure item:", error)
    return NextResponse.json({ error: "Failed to delete leisure item", details: error.message }, { status: 500 })
  }
}

