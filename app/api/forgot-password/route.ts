import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { identifier: email },
    });

    // Create new token
    await db.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email if Resend is configured
    if (resend) {
      const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`;
      
      await resend.emails.send({
        from: 'GariHub <noreply@garihub.com>',
        to: email,
        subject: 'Reset your GariHub password',
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
