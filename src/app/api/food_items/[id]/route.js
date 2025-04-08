import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();


export async function GET(req, context) {
 try {
   const { params } = context; // Destructure `params` from `context`
   const { id } = params; // Extract `id` from `params`


   const foodItem = await prisma.foodItem.findUnique({
     where: { id: parseInt(id) },
   });


   if (!foodItem) {
     return NextResponse.json({ error: "Food item not found" }, { status: 404 });
   }


   return NextResponse.json(foodItem, { status: 200 });
 } catch (error) {
   console.error("Error fetching food item:", error);
   return NextResponse.json({ error: "Failed to fetch food item" }, { status: 500 });
 }
}
