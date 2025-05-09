import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req, { params }) {
  try {
    const { id } = params
    const { tagId } = await req.json()

    if (!id || !tagId) {
      return NextResponse.json({ error: "Leisure Item ID and Tag ID are required" }, { status: 400 })
    }

    // Check if the leisure item and tag exist
    const leisureItem = await prisma.leisureItem.findUnique({ where: { id: Number.parseInt(id) } })
    const tag = await prisma.tag.findUnique({ where: { id: Number.parseInt(tagId) } })

    if (!leisureItem || !tag) {
      return NextResponse.json({ error: "Leisure Item or Tag not found" }, { status: 404 })
    }

    // Create the association in LeisureItemTag
    const leisureItemTag = await prisma.leisureItemTag.create({
      data: {
        leisureItemId: Number.parseInt(id),
        tagId: Number.parseInt(tagId),
      },
    })

    return NextResponse.json(leisureItemTag, { status: 201 })
  } catch (error) {
    console.error("Error associating tag with leisure item:", error)
    return NextResponse.json(
      { error: "Failed to associate tag with leisure item", details: error.message },
      { status: 500 },
    )
  }
}
