import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { service_item_id, tag_id } = await req.json(); // Assuming you send service_item_id and tag_id in the request

    const serviceItemTag = await prisma.service_item_tags.create({
      data: {
        service_item_id,
        tag_id,
      },
    });

    return NextResponse.json(serviceItemTag, { status: 201 });
  } catch (error) {
    console.error('Error creating service item tag:', error);
    return NextResponse.json({ error: 'Failed to create service item tag' }, { status: 500 });
  }
}
//WE SAVE THIS CODE SNIPPET FOR LATER