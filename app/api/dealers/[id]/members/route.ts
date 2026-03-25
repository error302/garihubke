import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const members = await db.dealerMember.findMany({
    where: { dealerId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ members });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { email, role } = await req.json();

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const member = await db.dealerMember.create({
    data: {
      dealerId: id,
      userId: user.id,
      role: role || 'STAFF',
    },
  });

  return NextResponse.json({ member }, { status: 201 });
}
