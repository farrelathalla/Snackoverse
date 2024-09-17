import { NextResponse } from 'next/server';
import { db } from '@/lib/db';  // Adjust the path to your Prisma DB setup

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  try {
    // Fetch the order with the provided orderId, including order items and user details
    const order = await db.order.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: {
          include: { address: true },
        },
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
