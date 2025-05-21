import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const includeTags = url.searchParams.get("includeTags") === "true"

    const leisureItems = await prisma.leisureItem.findMany({
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

    // Process all leisure items to handle images and format tags
    const processedItems = leisureItems.map((item) => {
      const processedItem = { ...item }

      // Convert image if present
      if (processedItem.image) {
        processedItem.image = Array.from(processedItem.image)
      }

      // Format tags properly if they were included
      if (includeTags && item.tags) {
        processedItem.tags = item.tags.map((tagRelation) => ({
          id: tagRelation.tag.id,
          name: tagRelation.tag.name,
        }))
      }

      return processedItem
    })

    return NextResponse.json(processedItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure items:", error)
    return NextResponse.json({ error: "Failed to fetch leisure items", details: error.message }, { status: 500 })
  }
}
