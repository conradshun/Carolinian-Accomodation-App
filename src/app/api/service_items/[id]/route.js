import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();


export async function GET(req, context) {
 try {
   const { params } = context; // Destructure `params` from `context`
   const { id } = params; // Extract `id` from `params`


   const serviceItem = await prisma.serviceItem.findUnique({
     where: { id: parseInt(id) },
   });


   if (!serviceItem) {
     return NextResponse.json({ error: "Service item not found" }, { status: 404 });
   }


   return NextResponse.json(serviceItem, { status: 200 });
 } catch (error) {
   console.error("Error fetching service item:", error);
   return NextResponse.json({ error: "Failed to fetch service item" }, { status: 500 });
 }
}
