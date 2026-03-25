import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const review = await db.review.findUnique({ where: { id } });

  if (!review) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (review.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await db.review.delete({ where: { id } });

  return NextResponse.json({ success: true });
}