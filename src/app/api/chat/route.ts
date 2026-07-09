import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// POST /api/chat — AI car concierge
// Body: { message: string, history?: [{role, content}] }
// Returns: { reply: string, recommendations?: string[] (slugs) }
export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()

  // Pull a small context of inventory so the model can recommend real cars
  const vehicles = await db.vehicle.findMany({
    where: { status: 'active' },
    take: 30,
    orderBy: { isFeatured: 'desc' },
    select: {
      slug: true, title: true, make: true, model: true, year: true, bodyType: true,
      fuelType: true, transmission: true, price: true, mileage: true, condition: true,
      drivetrain: true, exteriorColor: true, city: true,
    },
  })

  const inventoryDigest = vehicles
    .map((v) => `- ${v.title} | ${v.bodyType}/${v.fuelType}/${v.transmission}/${v.drivetrain} | KES ${v.price.toLocaleString()} | ${v.mileage ?? 0} km | ${v.city ?? 'Kenya'} | slug:${v.slug}`)
    .join('\n')

  const systemPrompt = `You are Gari, the AI car-buying concierge for GariHub KE — Kenya's premium vehicle marketplace.
Your job: help the user discover, compare, and shortlist cars from our live inventory. Be warm, premium, and crisp — like a knowledgeable friend who happens to be a car expert for the Kenyan market.

Guidelines:
- Always recommend specific cars from the inventory list below. Reference the model + year + price when you mention one.
- Be honest about trade-offs (fuel economy vs power, city vs off-road, etc.).
- If the user is vague, ask ONE short clarifying question (budget? body style? use case?).
- Keep replies under 120 words unless asked for depth. Use short paragraphs or 3-5 bullet points max.
- Mention M-Pesa finance, test drives, and trade-ins as relevant perks.
- For Kenyan context: mention Nairobi traffic, upcountry trips, fuel prices (~KES 195/L petrol, ~KES 175/L diesel), and resale value.
- When you recommend cars, ALWAYS append a final line: "RECS: slug1, slug2, slug3" (max 3 slugs from the inventory). This is parsed by the UI to render cards.

LIVE INVENTORY:
${inventoryDigest}`

  try {
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map((m: any) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
      temperature: 0.6,
      max_tokens: 600,
    })
    const reply = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a reply just now.'
    // Parse RECS line if present
    let recommendations: string[] = []
    const m = reply.match(/RECS:\s*([a-z0-9,\-\s]+)$/i)
    if (m) {
      recommendations = m[1].split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3)
    }
    const cleanReply = reply.replace(/RECS:.*$/is, '').trim()
    return NextResponse.json({ reply: cleanReply, recommendations })
  } catch (e: any) {
    console.error('Chat API error:', e)
    return NextResponse.json({ reply: 'Sorry, I had trouble reaching my brain. Please try again in a moment.', recommendations: [] })
  }
}
