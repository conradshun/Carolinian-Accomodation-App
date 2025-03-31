import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    // Handle form-data instead of JSON
    const formData = await req.formData()

    // Extract values from form data
    const serviceItemId = formData.get("serviceItemId")
    const tagId = formData.get("tagId")

    // Validate required fields
    if (!serviceItemId || !tagId) {
      return NextResponse.json({ error: "serviceItemId and tagId are required" }, { status: 400 })
    }

    // Convert to integers
    const serviceItemIdInt = Number.parseInt(serviceItemId)
    const tagIdInt = Number.parseInt(tagId)

    if (isNaN(serviceItemIdInt) || isNaN(tagIdInt)) {
      return NextResponse.json({ error: "serviceItemId and tagId must be valid numbers" }, { status: 400 })
    }

    const serviceItemTag = await prisma.serviceItemTag.create({
      data: {
        serviceItemId: serviceItemIdInt,
        tagId: tagIdInt,
      },
    })

    return NextResponse.json(serviceItemTag, { status: 201 })
  } catch (error) {
    console.error("Error creating service item tag:", error)
    return NextResponse.json({ error: "Failed to create service item tag", details: error.message }, { status: 500 })
  }
}

