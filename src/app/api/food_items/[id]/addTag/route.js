import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { tagId } = await req.json();

    if (!id || !tagId) {
      return NextResponse.json({ error: "Food Item ID and Tag ID are required" }, { status: 400 });
    }

    // Check if the food item and tag exist
    const foodItem = await prisma.foodItem.findUnique({ where: { id: parseInt(id) } });
    const tag = await prisma.tag.findUnique({ where: { id: parseInt(tagId) } });

    if (!foodItem || !tag) {
      return NextResponse.json({ error: "Food Item or Tag not found" }, { status: 404 });
    }

    // Create the association in FoodItemTag
    const foodItemTag = await prisma.foodItemTag.create({
      data: {
        foodItemId: parseInt(id),
        tagId: parseInt(tagId),
      },
    });

    return NextResponse.json(foodItemTag, { status: 201 });
  } catch (error) {
    console.error("Error associating tag with food item:", error);
    return NextResponse.json({ error: "Failed to associate tag with food item", details: error.message }, { status: 500 });
  }
}
