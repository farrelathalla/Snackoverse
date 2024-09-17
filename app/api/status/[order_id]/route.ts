  import { NextResponse } from 'next/server';
  import midtransClient from 'midtrans-client';
  import { db } from '@/lib/db';
  import { OrderStatus } from '@prisma/client';

  // Create Snap API instance
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
  });

  export async function GET(req: Request, { params }: { params: { order_id: string } }) {
    const { order_id } = params;

    try {
      const transactionStatus = await snap.transaction.status(`order-${order_id}`);
      const { transaction_status } = transactionStatus;

      let newStatus;
      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        newStatus = OrderStatus.Paid;
      } else if (transaction_status === 'pending') {
        newStatus = OrderStatus.Pending;
      } else {
        newStatus = OrderStatus.Pending;
      }

      const order = await db.order.update({
        where: { id: parseInt(order_id, 10) },
        data: { status: newStatus },
        include: { orderItems: true, user: true }, // Include user for notifications
      });

      // Decrease product stock if payment is successful
      if (newStatus === OrderStatus.Paid) {
        for (const item of order.orderItems) {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return NextResponse.json({ message: 'Order status and stock updated', status: newStatus });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update order status and stock' }, { status: 500 });
    }
  }

