import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { food_item_id } = req.query;
        const foodItem = await prisma.apiTable.findUnique({
          where: { id: parseInt(food_item_id) },
        });

        if (!foodItem) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(foodItem);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch food item" });
      } finally {
        await prisma.$disconnect();
      }
}
