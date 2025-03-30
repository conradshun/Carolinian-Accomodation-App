/* import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, description, image, direction_link, open_hours } = await req.json();

    const newServiceItem = await prisma.service_items.create({
      data: {
        name,
        description,
        image,
        direction_link,
        open_hours,
      },
    });

    return NextResponse.json(newServiceItem, { status: 201 });
  } catch (error) {
    console.error('Error creating service item:', error);
    return NextResponse.json({ error: 'Failed to create service item' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const serviceItems = await prisma.service_items.findMany();
    return NextResponse.json(serviceItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching service items:', error);
    return NextResponse.json({ error: 'Failed to fetch service items' }, { status: 500 });
  }
} */

//WE SAVE THIS CODE SNIPPET FOR LATER