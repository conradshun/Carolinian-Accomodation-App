import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request, context) {
  try {
    const { id } = context.params
    const url = new URL(request.url)
    const includeTags = url.searchParams.get("includeTags") === "true"

    if (!id) {
      return NextResponse.json({ error: "Leisure item ID is required" }, { status: 400 })
    }

    const leisureItem = await prisma.leisureItem.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        tags: includeTags
          ? {
              include: {
                tag: true,
              },
            }
          : undefined,
      },
    })

    if (!leisureItem) {
      return NextResponse.json({ error: "Leisure item not found" }, { status: 404 })
    }

    // Process the leisure item to handle image and format tags
    const processedItem = { ...leisureItem }

    // Convert image if present
    if (processedItem.image) {
      processedItem.image = Array.from(processedItem.image)
    }

    // Format tags properly if they were included
    if (includeTags && leisureItem.tags) {
      processedItem.tags = leisureItem.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
      }))
    }

    return NextResponse.json(processedItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure item:", error)
    return NextResponse.json({ error: "Failed to fetch leisure item", details: error.message }, { status: 500 })
  }
}
