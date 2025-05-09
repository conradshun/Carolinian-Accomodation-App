import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req, { params }) {
  try {
    const { id } = params
    const { tagId } = await req.json()

    if (!id || !tagId) {
      return NextResponse.json({ error: "Service Item ID and Tag ID are required" }, { status: 400 })
    }

    // Check if the service item and tag exist
    const serviceItem = await prisma.serviceItem.findUnique({ where: { id: Number.parseInt(id) } })
    const tag = await prisma.tag.findUnique({ where: { id: Number.parseInt(tagId) } })

    if (!serviceItem || !tag) {
      return NextResponse.json({ error: "Service Item or Tag not found" }, { status: 404 })
    }

    // Create the association in ServiceItemTag
    const serviceItemTag = await prisma.serviceItemTag.create({
      data: {
        serviceItemId: Number.parseInt(id),
        tagId: Number.parseInt(tagId),
      },
    })

    return NextResponse.json(serviceItemTag, { status: 201 })
  } catch (error) {
    console.error("Error associating tag with service item:", error)
    return NextResponse.json(
      { error: "Failed to associate tag with service item", details: error.message },
      { status: 500 },
    )
  }
}
