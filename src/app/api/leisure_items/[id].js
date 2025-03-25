import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { leisure_item_id } = req.query;
        const leisureItem = await prisma.apiTable.findUnique({
          where: { id: parseInt(leisure_item_id) },
        });

        if (!leisureItem) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(leisureItem);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch leisure item" });
      } finally {
        await prisma.$disconnect();
      }
}
