import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICE_IDS } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Create checkout session for subscription
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();

  let priceId: string;
  switch (tier) {
    case 'PRO':
      priceId = PRICE_IDS.PRO;
      break;
    case 'BUSINESS':
      priceId = PRICE_IDS.BUSINESS;
      break;
    default:
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`,
      metadata: { userId: session.user.id, tier },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}

// Get user's subscription
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = await db.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ subscription });
}
