import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    // Handle form-data instead of JSON
    const formData = await req.formData()

    // Extract values from form data
    const name = formData.get("name")
    const description = formData.get("description")
    const image = formData.get("image")
    const directionLink = formData.get("directionLink")
    const openHours = formData.get("openHours")

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Process image if provided (assuming it's a file)
    let imageData = null
    if (image && image instanceof Blob) {
      // Convert image to buffer if needed
      imageData = Buffer.from(await image.arrayBuffer())
    }

    const newFoodItem = await prisma.foodItem.create({
      data: {
        name,
        description: description || null,
        image: imageData,
        directionLink: directionLink || null,
        openHours: openHours || null,
      },
    })

    return NextResponse.json(newFoodItem, { status: 201 })
  } catch (error) {
    console.error("Error creating food item:", error)
    return NextResponse.json({ error: "Failed to create food item", details: error.message }, { status: 500 })
  }
}


export async function GET() {
  try {
    const foodItems = await prisma.foodItem.findMany()

    if (!foodItems) {
      return NextResponse.json({ error: "Food items not found" }, { status: 404 });
    }

    // Convert the byte array to a regular JavaScript array
    foodItems.forEach(item => {
      if (item.image) {
        item.image = Array.from(item.image);
      }
    });
    return NextResponse.json(foodItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 })
  }
}
