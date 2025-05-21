import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request, context) {
  try {
    // Correctly access the id from context.params
    const { id } = context.params

    if (!id) {
      return NextResponse.json({ error: "Food item ID is required" }, { status: 400 })
    }

    const foodItemId = Number.parseInt(id)

    // Get the food item with its tags
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!foodItem) {
      return NextResponse.json({ error: "Food item not found" }, { status: 404 })
    }

    // Extract and format tags
    const tags = foodItem.tags.map((tagRelation) => ({
      id: tagRelation.tag.id,
      name: tagRelation.tag.name,
    }))

    return NextResponse.json(tags, { status: 200 })
  } catch (error) {
    console.error("Error fetching food item tags:", error)
    return NextResponse.json({ error: "Failed to fetch food item tags", details: error.message }, { status: 500 })
  }
}
