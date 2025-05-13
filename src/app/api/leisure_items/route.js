import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leisureItems = await prisma.leisureItem.findMany()

    // Convert byte arrays to regular arrays for all leisure items
    const processedLeisureItems = leisureItems.map((item) => {
      if (item.image) {
        return {
          ...item,
          image: Array.from(item.image),
        }
      }
      return item
    })

    return NextResponse.json(processedLeisureItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure items:", error)
    return NextResponse.json({ error: "Failed to fetch leisure items", details: error.message }, { status: 500 })
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
      return NextResponse.json({ error: "Leisure item name is required" }, { status: 400 })
    }

    const leisureItem = await prisma.leisureItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        directionLink: data.directionLink || null,
        openHours: data.openHours || null,
      },
    })

    return NextResponse.json(leisureItem, { status: 201 })
  } catch (error) {
    console.error("Error creating leisure item:", error)
    return NextResponse.json({ error: "Failed to create leisure item", details: error.message }, { status: 500 })
  }
}
