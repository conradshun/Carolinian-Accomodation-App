import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { leisure_item_id, tag_id } = await req.json(); // Assuming you send leisure_item_id and tag_id in the request

    const leisureItemTag = await prisma.leisure_item_tags.create({
      data: {
        leisure_item_id,
        tag_id,
      },
    });

    return NextResponse.json(leisureItemTag, { status: 201 });
  } catch (error) {
    console.error('Error creating leisure item tag:', error);
    return NextResponse.json({ error: 'Failed to create leisure item tag' }, { status: 500 });
  }
}
//WE SAVE THIS CODE SNIPPET FOR LATER