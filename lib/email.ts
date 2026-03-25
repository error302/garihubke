import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'GariHub <noreply@garihub.co.ke>';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log('Email (mock):', { to, subject });
    return { success: true };
  }
  
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export const emailTemplates = {
  paymentVerified: (userName: string, vehicleTitle: string) => ({
    subject: 'Payment Verified - GariHub',
    html: `<h1>Payment Verified</h1><p>Hi ${userName},</p><p>Your payment for ${vehicleTitle} has been verified. We'll notify you when your vehicle is ready for collection.</p>`,
  }),
  
  orderCleared: (userName: string, vehicleTitle: string) => ({
    subject: 'Vehicle Cleared - Ready for Collection',
    html: `<h1>Vehicle Cleared!</h1><p>Hi ${userName},</p><p>Your ${vehicleTitle} is now cleared and ready for collection at Mombasa port.</p>`,
  }),
  
  newMessage: (userName: string, senderName: string) => ({
    subject: 'New Message - GariHub',
    html: `<h1>New Message</h1><p>Hi ${userName},</p><p>You have a new message from ${senderName}.</p>`,
  }),
  
  welcome: (userName: string) => ({
    subject: 'Welcome to GariHub!',
    html: `<h1>Welcome!</h1><p>Hi ${userName},</p><p>Thank you for joining GariHub - Kenya's premier car marketplace.</p>`,
  }),
};