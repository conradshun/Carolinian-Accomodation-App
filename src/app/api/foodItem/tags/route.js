import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    // Handle form-data instead of JSON
    const formData = await req.formData()

    // Extract values from form data
    const foodItemId = formData.get("foodItemId")
    const tagId = formData.get("tagId")

    // Validate required fields
    if (!foodItemId || !tagId) {
      return NextResponse.json({ error: "foodItemId and tagId are required" }, { status: 400 })
    }

    // Convert to integers
    const foodItemIdInt = Number.parseInt(foodItemId)
    const tagIdInt = Number.parseInt(tagId)

    if (isNaN(foodItemIdInt) || isNaN(tagIdInt)) {
      return NextResponse.json({ error: "foodItemId and tagId must be valid numbers" }, { status: 400 })
    }

    const foodItemTag = await prisma.foodItemTag.create({
      data: {
        foodItemId: foodItemIdInt,
        tagId: tagIdInt,
      },
    })

    return NextResponse.json(foodItemTag, { status: 201 })
  } catch (error) {
    console.error("Error creating food item tag:", error)
    return NextResponse.json({ error: "Failed to create food item tag", details: error.message }, { status: 500 })
  }
}


//Created a route at `app/api/food_items/tags/route.js` for adding tags to food items
//