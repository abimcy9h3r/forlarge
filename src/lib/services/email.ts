import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface PurchaseConfirmationEmailProps {
  buyerEmail: string;
  productTitle: string;
  amount: number;
  downloadToken: string;
}

export async function sendPurchaseConfirmationEmail({
  buyerEmail,
  productTitle,
  amount,
  downloadToken
}: PurchaseConfirmationEmailProps) {
  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://forlarge.app'}/download/${downloadToken}`;

  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: 'Forlarge <noreply@forlarge.app>',
      to: [buyerEmail],
      subject: `Your purchase of ${productTitle} is ready!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Confirmation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Purchase Confirmed!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for your purchase! Your payment has been confirmed and your product is ready to download.
              </p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h2 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 500;">Product Details</h2>
                <p style="margin: 5px 0;"><strong>Product:</strong> ${productTitle}</p>
                <p style="margin: 5px 0;"><strong>Amount Paid:</strong> $${amount} USDC</p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${downloadUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
                  Download Now
                </a>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>Important:</strong> This download link will expire in 24 hours and can be used up to 5 times.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you have any questions or issues, please contact our support team.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Forlarge. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

interface NewSaleNotificationProps {
  creatorEmail: string;
  productTitle: string;
  amount: number;
  buyerWallet: string;
}

export async function sendNewSaleNotification({
  creatorEmail,
  productTitle,
  amount,
  buyerWallet
}: NewSaleNotificationProps) {
  const platformFee = amount * 0.05;
  const creatorAmount = amount * 0.95;

  const client = getResendClient();
  if (!client) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: 'Forlarge <noreply@forlarge.app>',
      to: [creatorEmail],
      subject: `🎉 New sale: ${productTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Sale Notification</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">🎉 You Made a Sale!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Congratulations! Someone just purchased your product.
              </p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 500;">Sale Details</h2>
                <p style="margin: 5px 0;"><strong>Product:</strong> ${productTitle}</p>
                <p style="margin: 5px 0;"><strong>Sale Price:</strong> $${amount} USDC</p>
                <p style="margin: 5px 0;"><strong>Your Earnings:</strong> $${creatorAmount.toFixed(2)} USDC (95%)</p>
                <p style="margin: 5px 0; font-size: 12px; color: #6b7280;"><strong>Platform Fee:</strong> $${platformFee.toFixed(2)} USDC (5%)</p>
                <p style="margin: 5px 0; font-size: 14px; color: #6b7280;"><strong>Buyer:</strong> ${buyerWallet.slice(0, 6)}...${buyerWallet.slice(-4)}</p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://forlarge.app'}/dashboard/sales" style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
                  View Sales Dashboard
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Your earnings have been sent to your connected wallet instantly.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Forlarge. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
