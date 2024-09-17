import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { notificationId: string } }) {
  const { notificationId } = params;

  try {
    const notification = await db.notification.update({
      where: { id: parseInt(notificationId, 10) },
      data: { status: 'Read' },
      include: {
        order: {
          include: {
            orderItems: { include: { product: true } },
            user: { include: { address: true } },
          },
        },
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notification details' }, { status: 500 });
  }
}
