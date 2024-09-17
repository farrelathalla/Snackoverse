import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: { status: 'Paid' },
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching paid orders:', error);
    return NextResponse.json({ error: 'Failed to fetch paid orders' }, { status: 500 });
  }
}
