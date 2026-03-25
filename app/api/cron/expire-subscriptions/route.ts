import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Deactivate expired subscriptions
  const expiredSubs = await db.subscription.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });

  // End expired ad campaigns
  const expiredCampaigns = await db.adCampaign.updateMany({
    where: {
      isActive: true,
      endDate: { lt: new Date() },
    },
    data: { isActive: false },
  });

  return NextResponse.json({
    expiredSubscriptions: expiredSubs.count,
    expiredCampaigns: expiredCampaigns.count,
  });
}
