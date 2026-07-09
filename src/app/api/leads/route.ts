import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/leads — create a lead (inquiry, test drive, offer, finance, trade-in)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const lead = await db.lead.create({
    data: {
      vehicleId: body.vehicleId || null,
      dealerId: body.dealerId || null,
      type: body.type || 'inquiry',
      status: 'new',
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      message: body.message || '',
      budget: body.budget || null,
    },
  })
  if (body.vehicleId) {
    await db.vehicle.update({ where: { id: body.vehicleId }, data: { leadsCount: { increment: 1 } } })
  }
  return NextResponse.json({ lead })
}

// GET /api/leads — admin: list leads
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const take = searchParams.get('take') ? Number(searchParams.get('take')) : 100
  const where: any = {}
  if (status) where.status = status
  const leads = await db.lead.findMany({
    where,
    take,
    orderBy: { createdAt: 'desc' },
    include: { vehicle: true },
  })
  return NextResponse.json({ leads })
}
