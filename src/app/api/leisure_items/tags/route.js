import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    // This endpoint doesn't have an ID parameter, so we don't need to access context.params
    const tags = await prisma.tag.findMany({
      where: {
        leisureItems: {
          some: {}, // Tags that are associated with at least one leisure item
        },
      },
    })

    if (!tags || tags.length === 0) {
      return NextResponse.json({ tags: [] }, { status: 200 })
    }

    // Return tags in a consistent format
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }))

    return NextResponse.json(formattedTags, { status: 200 })
  } catch (error) {
    console.error("Error fetching leisure item tags:", error)
    return NextResponse.json({ error: "Failed to fetch leisure item tags", details: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // This endpoint doesn't have an ID parameter, so we don't need to access context.params

    // Parse request body
    const contentType = request.headers.get("content-type")
    let name

    if (contentType && contentType.includes("application/json")) {
      const data = await request.json()
      name = data.name
    } else if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
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
          tag: {
            id: existingTag.id,
            name: existingTag.name,
          },
        },
        { status: 200 },
      )
    }

    // Create the tag
    const tag = await prisma.tag.create({
      data: {
        name: name,
      },
    })

    return NextResponse.json(
      {
        id: tag.id,
        name: tag.name,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag", details: error.message }, { status: 500 })
  }
}
