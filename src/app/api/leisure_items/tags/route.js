import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    // Handle form-data instead of JSON
    const formData = await req.formData()

    // Extract values from form data
    const leisureItemId = formData.get("leisureItemId")
    const tagId = formData.get("tagId")

    // Validate required fields
    if (!leisureItemId || !tagId) {
      return NextResponse.json({ error: "leisureItemId and tagId are required" }, { status: 400 })
    }

    // Convert to integers
    const leisureItemIdInt = Number.parseInt(leisureItemId)
    const tagIdInt = Number.parseInt(tagId)

    if (isNaN(leisureItemIdInt) || isNaN(tagIdInt)) {
      return NextResponse.json({ error: "leisureItemId and tagId must be valid numbers" }, { status: 400 })
    }

    const leisureItemTag = await prisma.leisureItemTag.create({
      data: {
        leisureItemId: leisureItemIdInt,
        tagId: tagIdInt,
      },
    })

    return NextResponse.json(leisureItemTag, { status: 201 })
  } catch (error) {
    console.error("Error creating leisure item tag:", error)
    return NextResponse.json({ error: "Failed to create leisure item tag", details: error.message }, { status: 500 })
  }
}

