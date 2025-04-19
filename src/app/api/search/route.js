import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userInput = searchParams.get('query');

        if (!userInput) {
            return NextResponse.json({ error: "Missing search query" }, { status: 400 });
        }

        const lowerCaseInput = userInput.toLowerCase(); // Convert the search input to lowercase

        let results = [];

        // Search FoodItems
        const foodItems = await prisma.FoodItem.findMany({
            where: {
                OR: [
                    { name: { contains: lowerCaseInput } }, // Use lowercase input for search
                ],
            },
            select: {
                id: true,
                name: true,
            },
        });
        results = results.concat(foodItems);

        // Search LeisureItems
        const leisureItems = await prisma.LeisureItem.findMany({
            where: {
                OR: [
                    { name: { contains: lowerCaseInput } }, // Use lowercase input for search
                ],
            },
            select: {
                id: true,
                name: true,
            },
        });
        results = results.concat(leisureItems);

        // Search ServiceItems
        const serviceItems = await prisma.ServiceItem.findMany({
            where: {
                OR: [
                    { name: { contains: lowerCaseInput } }, // Use lowercase input for search
                ],
            },
            select: {
                id: true,
                name: true,
            },
        });
        results = results.concat(serviceItems);

        if (results.length === 0) {
            return NextResponse.json({ message: "No items found" }, { status: 200 });
        }

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Error during search:", error);
        return NextResponse.json({ error: "Failed to perform search", details: error.message }, { status: 500 });
    }
}
