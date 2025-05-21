import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request, context) {
  try {
    // Correctly access the id from context.params
    const { id } = context.params

    if (!id) {
      return NextResponse.json({ error: "Service item ID is required" }, { status: 400 })
    }

    // Parse request body
    const contentType = request.headers.get("content-type")
    let tagId

    if (contentType && contentType.includes("application/json")) {
      const data = await request.json()
      tagId = data.tagId
    } else if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      tagId = formData.get("tagId")
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 })
    }

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 })
    }

    // Convert IDs to numbers
    const serviceItemId = Number.parseInt(id)
    const parsedTagId = Number.parseInt(tagId)

    // Check if service item exists
    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id: serviceItemId },
    })

    if (!serviceItem) {
      return NextResponse.json({ error: "Service item not found" }, { status: 404 })
    }

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id: parsedTagId },
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Check if the association already exists
    const existingAssociation = await prisma.serviceItemTag.findFirst({
      where: {
        serviceItemId: serviceItemId,
        tagId: parsedTagId,
      },
    })

    if (existingAssociation) {
      return NextResponse.json({ message: "Tag is already associated with this service item" }, { status: 200 })
    }

    // Create the association
    const association = await prisma.serviceItemTag.create({
      data: {
        serviceItemId: serviceItemId,
        tagId: parsedTagId,
      },
      include: {
        tag: true,
      },
    })

    return NextResponse.json(
      {
        message: "Tag added successfully",
        association: {
          id: association.id,
          serviceItemId: association.serviceItemId,
          tagId: association.tagId,
          tag: association.tag,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding tag to service item:", error)
    return NextResponse.json({ error: "Failed to add tag to service item", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  try {
    // Correctly access the id from context.params
    const { id } = context.params

    if (!id) {
      return NextResponse.json({ error: "Service item ID is required" }, { status: 400 })
    }

    // Parse request body
    const contentType = request.headers.get("content-type")
    let tagId

    if (contentType && contentType.includes("application/json")) {
      const data = await request.json()
      tagId = data.tagId
    } else if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      tagId = formData.get("tagId")
    } else {
      // Try to get tagId from URL search params
      const url = new URL(request.url)
      tagId = url.searchParams.get("tagId")

      if (!tagId) {
        return NextResponse.json({ error: "Tag ID is required" }, { status: 400 })
      }
    }

    // Convert IDs to numbers
    const serviceItemId = Number.parseInt(id)
    const parsedTagId = Number.parseInt(tagId)

    // Delete the association
    await prisma.serviceItemTag.deleteMany({
      where: {
        serviceItemId: serviceItemId,
        tagId: parsedTagId,
      },
    })

    return NextResponse.json({ message: "Tag removed successfully from service item" }, { status: 200 })
  } catch (error) {
    console.error("Error removing tag from service item:", error)
    return NextResponse.json(
      { error: "Failed to remove tag from service item", details: error.message },
      { status: 500 },
    )
  }
}
