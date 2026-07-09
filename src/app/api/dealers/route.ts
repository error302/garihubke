import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dealers
export async function GET() {
  const dealers = await db.dealer.findMany({
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }],
    include: { _count: { select: { vehicles: true } } },
  })
  return NextResponse.json({ dealers })
}
