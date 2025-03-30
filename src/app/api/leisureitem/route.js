/*import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, description, image, direction_link, open_hours } = await req.json();

    const newLeisureItem = await prisma.leisure_items.create({
      data: {
        name,
        description,
        image,
        direction_link,
        open_hours,
      },
    });

    return NextResponse.json(newLeisureItem, { status: 201 });
  } catch (error) {
    console.error('Error creating leisure item:', error);
    return NextResponse.json({ error: 'Failed to create leisure item' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const leisureItems = await prisma.leisure_items.findMany();
    return NextResponse.json(leisureItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching leisure items:', error);
    return NextResponse.json({ error: 'Failed to fetch leisure items' }, { status: 500 });
  }
} */

//WE SAVE THIS CODE SNIPPET FOR LATER