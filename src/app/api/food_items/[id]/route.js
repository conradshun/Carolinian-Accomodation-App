import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { id } = params

    const foodItem = await prisma.foodItem.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!foodItem) {
      return NextResponse.json({ error: "Food item not found" }, { status: 404 })
    }

    // Convert the byte array to a regular JavaScript array
    if (foodItem.image) {
      foodItem.image = Array.from(foodItem.image)
    }

    return NextResponse.json(foodItem, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch food item" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const idInt = Number.parseInt(id)

    if (isNaN(idInt)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    // Check if the item exists first
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: idInt },
    })

    if (!foodItem) {
      return NextResponse.json({ error: "Food item not found" }, { status: 404 })
    }

    // Delete the item
    await prisma.foodItem.delete({
      where: { id: idInt },
    })

    return NextResponse.json({ message: `Food item with ID ${idInt} deleted successfully` }, { status: 200 })
  } catch (error) {
    console.error("Error deleting food item:", error)
    return NextResponse.json({ error: "Failed to delete food item", details: error.message }, { status: 500 })
  }
}
