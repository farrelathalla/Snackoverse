import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Fetch notifications with the status "Read"
  const notifications = await db.notification.findMany({
    where: {
      userId: parseInt(session.user.id),
      status: 'Read',
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(notifications);
}
