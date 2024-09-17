import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const count = await db.order.count({
      where: { status: 'Paid' }
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch paid orders count' }, { status: 500 });
  }
}
