import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const serviceItems = await prisma.serviceItem.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Process all service items to handle images and format tags
    const processedItems = serviceItems.map((item) => {
      const processedItem = { ...item }

      // Convert image if present
      if (processedItem.image) {
        processedItem.image = Array.from(processedItem.image)
      }

      // Transform tags to a simpler format
      processedItem.tags = item.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
      }))

      return processedItem
    })

    return NextResponse.json(processedItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching service items:", error)
    return NextResponse.json({ error: "Failed to fetch service items", details: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type")
    let data = {}

    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      
      // Debug: Log all form fields
      console.log("Form data fields:", Array.from(formData.entries()).map(entry => `${entry[0]}: ${entry[1]}`))
      
      // Extract all text fields
      data.name = formData.get("name")
      data.description = formData.get("description")
      
      // Fix for directionLink and openHours
      data.directionLink = formData.get("directionLink") || null
      data.openHours = formData.get("openHours") || null
      
      console.log("Extracted text fields:", {
        name: data.name,
        description: data.description,
        directionLink: data.directionLink,
        openHours: data.openHours
      })

      // Handle image if present
      if (formData.has("image")) {
        const imageFile = formData.get("image")
        if (imageFile && typeof imageFile === "object" && imageFile.arrayBuffer) {
          const buffer = await imageFile.arrayBuffer()
          data.image = new Uint8Array(buffer)
          console.log("Image processed successfully, size:", data.image.length)
        } else {
          console.log("Image field exists but is not a valid file:", imageFile)
        }
      }
    } else if (contentType && contentType.includes("application/json")) {
      data = await req.json()
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 })
    }

    if (!data.name) {
      return NextResponse.json({ error: "Service item name is required" }, { status: 400 })
    }

    // Create the service item with explicit field mapping
    const serviceItem = await prisma.serviceItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        directionLink: data.directionLink || null,
        openHours: data.openHours || null,
      },
    })

    // Create a clean response object
    const responseItem = {
      ...serviceItem,
      image: serviceItem.image ? Array.from(serviceItem.image) : null,
      tags: []
    }

    console.log("Created service item:", {
      id: responseItem.id,
      name: responseItem.name,
      directionLink: responseItem.directionLink,
      openHours: responseItem.openHours
    })

    return NextResponse.json(responseItem, { status: 201 })
  } catch (error) {
    console.error("Error creating service item:", error)
    return NextResponse.json({ error: "Failed to create service item", details: error.message }, { status: 500 })
  }
}