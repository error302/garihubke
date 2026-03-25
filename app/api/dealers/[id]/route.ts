import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const dealer = await db.dealer.findUnique({
    where: { id, isDeleted: false, isSuspended: false },
    include: {
      members: true,
      inventory: {
        where: { stockStatus: 'AVAILABLE' },
        include: { listing: true },
      },
    },
  });

  if (!dealer) {
    return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
  }

  return NextResponse.json({ dealer });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const membership = await db.dealerMember.findFirst({
    where: { dealerId: id, userId: session.user.id },
  });

  if (!membership || !['ADMIN', 'MANAGER'].includes(membership.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const dealer = await db.dealer.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ dealer });
}
