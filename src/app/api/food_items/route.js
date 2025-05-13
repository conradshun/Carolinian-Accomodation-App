import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const foodItems = await prisma.foodItem.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Process all food items to handle images and format tags
    const processedItems = foodItems.map((item) => {
      const processedItem = { ...item }

      // Convert image if present
      if (processedItem.image) {
        processedItem.image = Array.from(processedItem.image)
      }

      // Transform tags to a simpler format
      processedItem.tags = item.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
      }))

      return processedItem
    })

    return NextResponse.json(processedItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json({ error: "Failed to fetch food items", details: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await req.json()
    } else if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      data = Object.fromEntries(formData)

      // Handle image if present
      if (data.image && typeof data.image === "object") {
        const buffer = await data.image.arrayBuffer()
        data.image = new Uint8Array(buffer)
      }
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 })
    }

    if (!data.name) {
      return NextResponse.json({ error: "Food item name is required" }, { status: 400 })
    }

    const foodItem = await prisma.foodItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        directionLink: data.directionLink || null,
        openHours: data.openHours || null,
      },
    })

    return NextResponse.json(foodItem, { status: 201 })
  } catch (error) {
    console.error("Error creating food item:", error)
    return NextResponse.json({ error: "Failed to create food item", details: error.message }, { status: 500 })
  }
}
