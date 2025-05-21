import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get("type") // 'food', 'leisure', or 'service'

    let whereClause = {}

    // If type is specified, filter tags by that type
    if (type) {
      if (type === "food") {
        whereClause = {
          foodItems: {
            some: {},
          },
        }
      } else if (type === "leisure") {
        whereClause = {
          leisureItems: {
            some: {},
          },
        }
      } else if (type === "service") {
        whereClause = {
          serviceItems: {
            some: {},
          },
        }
      }
    }

    const tags = await prisma.tag.findMany({
      where: whereClause,
    })

    if (!tags || tags.length === 0) {
      return NextResponse.json({ tags: [] }, { status: 200 })
    }
    return NextResponse.json(tags, { status: 200 })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags", details: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    let name

    // Inspect the Content-Type header
    const contentType = req.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      // Parse as JSON
      const jsonData = await req.json()
      name = jsonData.name
    } else if (contentType && contentType.includes("multipart/form-data")) {
      // Parse as FormData
      const formData = await req.formData()
      name = formData.get("name")
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 })
    }

    // Convert name to lowercase for case-insensitive comparison
    const lowerCaseName = name.toLowerCase()

    // Check if tag with this name already exists (case-insensitive)
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: {
          contains: lowerCaseName,
        },
      },
    })

    // If we find a tag, do an additional check to ensure it's a case-insensitive match
    if (existingTag && existingTag.name.toLowerCase() === lowerCaseName) {
      return NextResponse.json(
        {
          message: "Tag already exists",
          tag: existingTag,
        },
        { status: 200 },
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name: name,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag", details: error.message }, { status: 500 })
  }
}
