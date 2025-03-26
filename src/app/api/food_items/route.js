import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, description, image, direction_link, open_hours } = await req.json();

    const newFoodItem = await prisma.food_items.create({
      data: {
        name,
        description,
        image,
        direction_link,
        open_hours,
      },
    });

    return NextResponse.json(newFoodItem, { status: 201 });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json({ error: 'Failed to create food item' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const foodItems = await prisma.food_items.findMany();
    return NextResponse.json(foodItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json({ error: 'Failed to fetch food items' }, { status: 500 });
  }
}

//WE SAVE THIS CODE SNIPPET FOR LATER