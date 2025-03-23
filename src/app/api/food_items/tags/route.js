import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { food_item_id, tag_id } = await req.json(); // Assuming you send food_item_id and tag_id in the request

    const foodItemTag = await prisma.food_item_tags.create({
      data: {
        food_item_id,
        tag_id,
      },
    });

    return NextResponse.json(foodItemTag, { status: 201 });
  } catch (error) {
    console.error('Error creating food item tag:', error);
    return NextResponse.json({ error: 'Failed to create food item tag' }, { status: 500 });
  }
}
//WE SAVE THIS CODE SNIPPET FOR LATER