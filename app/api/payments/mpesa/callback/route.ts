import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { Body } = body;
    
    if (!Body?.stkCallback) {
      return NextResponse.json({ error: 'Invalid callback' }, { status: 400 });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;

    if (ResultCode === 0) {
      const metadata = Body.stkCallback.CallbackMetadata?.Item || [];
      const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
      const mpesaCode = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phone = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;

      console.log('Payment successful:', { MerchantRequestID, amount, mpesaCode, phone });
    } else {
      console.log('Payment failed:', ResultDesc);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}
