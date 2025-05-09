import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 })
    }

    const tag = await prisma.tag.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        leisureItems: {
          include: {
            leisureItem: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Transform the response to include leisure items in a cleaner format
    const transformedTag = {
      ...tag,
      leisureItems: tag.leisureItems.map((relation) => ({
        id: relation.leisureItem.id,
        name: relation.leisureItem.name,
        description: relation.leisureItem.description,
        price: relation.leisureItem.price,
      })),
    }

    return NextResponse.json(transformedTag, { status: 200 })
  } catch (error) {
    console.error("Error fetching tag:", error)
    return NextResponse.json({ error: "Failed to fetch tag", details: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 })
    }

    // First check if the tag exists
    const tag = await prisma.tag.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Delete the tag
    await prisma.tag.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return NextResponse.json({ message: "Tag deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json({ error: "Failed to delete tag", details: error.message }, { status: 500 })
  }
}
