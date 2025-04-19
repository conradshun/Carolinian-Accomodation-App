// app/api/tagSearch/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userInput = searchParams.get('query');

        if (!userInput) {
            return NextResponse.json({ error: "Missing search query" }, { status: 400 });
        }

        const lowerCaseInput = userInput.toLowerCase();

        // Find items that match tag name
        const foodItems = await prisma.FoodItem.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            name: {
                                contains: lowerCaseInput
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true
            }
        });

        const leisureItems = await prisma.LeisureItem.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            name: {
                                contains: lowerCaseInput
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true
            }
        });

        const serviceItems = await prisma.ServiceItem.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            name: {
                                contains: lowerCaseInput
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true
            }
        });

        const results = [
            ...foodItems,
            ...leisureItems,
            ...serviceItems,
        ];

        if (results.length === 0) {
            return NextResponse.json({ message: "No items found" }, { status: 200 });
        }

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Error during tag search:", error);
        return NextResponse.json({ error: "Failed to perform tag search", details: error.message }, { status: 500 });
    }
}