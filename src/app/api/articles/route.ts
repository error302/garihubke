import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/articles
export async function GET() {
  const articles = await db.article.findMany({ orderBy: { publishedAt: 'desc' } })
  return NextResponse.json({ articles })
}
