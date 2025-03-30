import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { service_item_id } = req.query;
        const serviceItem = await prisma.apiTable.findUnique({
          where: { id: parseInt(service_item_id) },
        });

        if (!serviceItem) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(serviceItem);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch service item" });
      } finally {
        await prisma.$disconnect();
      }
}
