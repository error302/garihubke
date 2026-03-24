import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;

      if (userId && tier) {
        await db.subscription.create({
          data: {
            userId,
            tier,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: 'ACTIVE',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: 'CANCELLED' },
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata?.userId;

      if (userId) {
        await db.subscription.updateMany({
          where: { userId, status: 'ACTIVE' },
          data: { status: 'PENDING' },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
