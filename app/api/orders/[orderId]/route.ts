import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  try {
    const order = await db.order.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: {
        user: { include: { address: true } }, // Ensure address is included
        orderItems: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}
