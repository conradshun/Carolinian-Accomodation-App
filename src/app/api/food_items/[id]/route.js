import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request, context) {
  try {
    const { id } = context.params
    const url = new URL(request.url)
    const includeTags = url.searchParams.get("includeTags") === "true"

    if (!id) {
      return NextResponse.json({ error: "Food item ID is required" }, { status: 400 })
    }

    const foodItem = await prisma.foodItem.findUnique({
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

    if (!foodItem) {
      return NextResponse.json({ error: "Food item not found" }, { status: 404 })
    }

    // Process the food item to handle image and format tags
    const processedItem = { ...foodItem }

    // Convert image if present
    if (processedItem.image) {
      processedItem.image = Array.from(processedItem.image)
    }

    // Format tags properly if they were included
    if (includeTags && foodItem.tags) {
      processedItem.tags = foodItem.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
      }))
    }

    return NextResponse.json(processedItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching food item:", error)
    return NextResponse.json({ error: "Failed to fetch food item", details: error.message }, { status: 500 })
  }
}
