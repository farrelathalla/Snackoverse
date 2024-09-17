import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';  // Adjust the path to your auth options
import { db } from '@/lib/db';  // Adjust the path to your Prisma DB setup

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch the user's orders sorted by createdAt (newest first)
    const orders = await db.order.findMany({
      where: { userId: parseInt(session.user.id, 10) },
      include: {
        orderItems: {
          include: { product: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    return NextResponse.json({ error: 'Failed to fetch order history' }, { status: 500 });
  }
}
