import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const city = searchParams.get('city');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  const where: any = { isDeleted: false, isSuspended: false };
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (city) {
    where.city = city;
  }

  const [dealers, total] = await Promise.all([
    db.dealer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.dealer.count({ where }),
  ]);

  return NextResponse.json({ dealers, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, email, city } = body;

  const dealer = await db.dealer.create({
    data: {
      userId: session.user.id,
      name,
      phone,
      email,
      city,
    },
  });

  return NextResponse.json({ dealer }, { status: 201 });
}
