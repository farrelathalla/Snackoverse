import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus, NotifStatus, Roles } from '@prisma/client';

export async function PUT(req: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  try {
    // Update the order status to Shipped
    const order = await db.order.update({
      where: { id: parseInt(orderId, 10) },
      data: { status: OrderStatus.Shipped },
      include: { user: true }, // Include user details for creating a notification
    });

    // Create a notification for the user
    await db.notification.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        message: `Your order ${order.id} has been shipped.`,
        recipient: Roles.Consumer,  // Assuming the user role is Consumer
        status: NotifStatus.Unread,
      },
    });

    return NextResponse.json({ message: 'Order status updated to Shipped and notification sent', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
