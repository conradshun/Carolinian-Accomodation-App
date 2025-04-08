import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();


export async function GET(req, context) {
 try {
   const { params } = context; // Destructure `params` from `context`
   const { id } = params; // Extract `id` from `params`


   const leisureItem = await prisma.leisureItem.findUnique({
     where: { id: parseInt(id) },
   });


   if (!leisureItem) {
     return NextResponse.json({ error: "Leisure item not found" }, { status: 404 });
   }


   return NextResponse.json(leisureItem, { status: 200 });
 } catch (error) {
   console.error("Error fetching leisure item:", error);
   return NextResponse.json({ error: "Failed to fetch leisure item" }, { status: 500 });
 }
}
