import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request, context) {
  try {
    // Correctly access the id from context.params
    const { id } = context.params

    if (!id) {
      return NextResponse.json({ error: "Leisure item ID is required" }, { status: 400 })
    }

    const leisureItemId = Number.parseInt(id)

    // Get the leisure item with its tags
    const leisureItem = await prisma.leisureItem.findUnique({
      where: { id: leisureItemId },
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

    // Extract and format tags
    const tags = leisureItem.tags.map((tagRelation) => ({
      id: tagRelation.tag.id,
      name: tagRelation.tag.name,
    }))

    return NextResponse.json(tags, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure item tags:", error)
    return NextResponse.json({ error: "Failed to fetch leisure item tags", details: error.message }, { status: 500 })
  }
}
