import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Params { params: Promise<{ id: string }> }

// PATCH /api/admin/vehicles/[id] — update vehicle fields (status, featured, price, etc.)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const allowed = ['status', 'isFeatured', 'isPremium', 'isVerified', 'price', 'mileage', 'description', 'title', 'condition']
  const data: any = {}
  for (const k of allowed) {
    if (k in body) data[k] = body[k]
  }
  const vehicle = await db.vehicle.update({ where: { id }, data })
  return NextResponse.json({ vehicle })
}

// DELETE /api/admin/vehicles/[id] — delete vehicle
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  await db.vehicle.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
