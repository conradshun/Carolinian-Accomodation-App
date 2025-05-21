import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request, context) {
  try {
    // Correctly access the id from context.params
    const { id } = context.params

    if (!id) {
      return NextResponse.json({ error: "Service item ID is required" }, { status: 400 })
    }

    const serviceItemId = Number.parseInt(id)

    // Get the service item with its tags
    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id: serviceItemId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!serviceItem) {
      return NextResponse.json({ error: "Service item not found" }, { status: 404 })
    }

    // Extract and format tags
    const tags = serviceItem.tags.map((tagRelation) => ({
      id: tagRelation.tag.id,
      name: tagRelation.tag.name,
    }))

    return NextResponse.json(tags, { status: 200 })
  } catch (error) {
    console.error("Error fetching service item tags:", error)
    return NextResponse.json({ error: "Failed to fetch service item tags", details: error.message }, { status: 500 })
  }
}
