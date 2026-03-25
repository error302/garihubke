import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const apiKeys = await db.dealerApiAccess.findMany({
    where: { dealerId: id },
    select: { id: true, name: true, lastUsedAt: true, isActive: true, createdAt: true },
  });

  return NextResponse.json({ apiKeys });
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
  const { name } = await req.json();
  
  const apiKey = randomBytes(32).toString('hex');
  const apiKeyHash = `sk_${apiKey}`;

  const access = await db.dealerApiAccess.create({
    data: {
      dealerId: id,
      apiKeyHash,
      name,
    },
  });

  return NextResponse.json({ 
    apiKey: access.apiKeyHash,
    name: access.name,
    id: access.id,
  }, { status: 201 });
}
