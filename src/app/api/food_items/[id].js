import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const foodItem = await prisma.foodItem.findUnique({
      where: { id },
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

    return NextResponse.json(foodItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching food item:", error)
    return NextResponse.json({ error: "Failed to fetch food item", details: error.message }, { status: 500 })
  }
}

//Created a dynamic route at `app/api/food_items/[id]/route.js` for getting a specific food item