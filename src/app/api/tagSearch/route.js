import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userInput = searchParams.get("query")
    const itemType = searchParams.get("type") // Optional: 'food', 'leisure', or 'service'

    if (!userInput) {
      return NextResponse.json({ error: "Missing search query" }, { status: 400 })
    }

    // Convert to lowercase for case-insensitive search
    const lowerCaseInput = userInput.toLowerCase()

    // Use contains for case-insensitive search
    const tagFilter = {
      name: {
        contains: lowerCaseInput,
      },
    }

    let results = []

    try {
      // If itemType is specified, only search that type
      if (itemType) {
        switch (itemType.toLowerCase()) {
          case "food":
            results = await searchFoodItems(tagFilter)
            break
          case "leisure":
            results = await searchLeisureItems(tagFilter)
            break
          case "service":
            results = await searchServiceItems(tagFilter)
            break
          default:
            return NextResponse.json(
              { error: "Invalid item type. Use 'food', 'leisure', or 'service'" },
              { status: 400 },
            )
        }
      } else {
        // Search all item types
        const [foodItems, leisureItems, serviceItems] = await Promise.all([
          searchFoodItems(tagFilter).catch((err) => {
            console.error("Error searching food items:", err)
            return []
          }),
          searchLeisureItems(tagFilter).catch((err) => {
            console.error("Error searching leisure items:", err)
            return []
          }),
          searchServiceItems(tagFilter).catch((err) => {
            console.error("Error searching service items:", err)
            return []
          }),
        ])

        results = [
          ...foodItems.map((item) => ({ ...item, type: "food" })),
          ...leisureItems.map((item) => ({ ...item, type: "leisure" })),
          ...serviceItems.map((item) => ({ ...item, type: "service" })),
        ]
      }

      if (results.length === 0) {
        return NextResponse.json({ message: "No items found", results: [] }, { status: 200 })
      }

      return NextResponse.json(results, { status: 200 })
    } catch (innerError) {
      console.error("Error during tag search processing:", innerError)
      return NextResponse.json({ error: "Failed to process tag search", details: innerError.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error during tag search:", error)
    return NextResponse.json({ error: "Failed to perform tag search", details: error.message }, { status: 500 })
  }
}

// Helper functions to keep the main function clean
async function searchFoodItems(tagFilter) {
  const prisma = new PrismaClient()
  return prisma.foodItem
    .findMany({
      where: {
        tags: {
          some: {
            tag: tagFilter,
          },
        },
      },
      select: {
        id: true,
        name: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
      })),
    )
}

async function searchLeisureItems(tagFilter) {
  const prisma = new PrismaClient()
  return prisma.leisureItem
    .findMany({
      where: {
        tags: {
          some: {
            tag: tagFilter,
          },
        },
      },
      select: {
        id: true,
        name: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
      })),
    )
}

async function searchServiceItems(tagFilter) {
  const prisma = new PrismaClient()
  return prisma.serviceItem
    .findMany({
      where: {
        tags: {
          some: {
            tag: tagFilter,
          },
        },
      },
      select: {
        id: true,
        name: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
      })),
    )
}
