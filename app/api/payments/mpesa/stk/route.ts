import { NextRequest, NextResponse } from 'next/server';
import { initiateSTKPush, validatePhone, formatPhone } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount required' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const formattedPhone = formatPhone(phone);
    const result = await initiateSTKPush(formattedPhone, amount);

    return NextResponse.json(result);
  } catch (error) {
    console.error('M-Pesa error:', error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
