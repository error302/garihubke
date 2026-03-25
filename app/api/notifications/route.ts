import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await db.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { notificationIds, markAllRead } = await req.json();

  if (markAllRead) {
    await db.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
  } else if (notificationIds) {
    await db.notification.updateMany({
      where: { id: { in: notificationIds }, userId: session.user.id },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
