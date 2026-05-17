import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const STATUS_INFO: Record<string, { subject: string; emoji: string; message: string }> = {
  packed: {
    subject: 'Your order is packed and ready to ship 📦',
    emoji: '📦',
    message: 'Great news! Your order has been carefully packed and is ready for dispatch. You will receive another update once it ships.',
  },
  shipped: {
    subject: 'Your order is on the way 🚚',
    emoji: '🚚',
    message: 'Your BeJeweled order is on its way to you! Expected delivery in 3-5 business days.',
  },
  delivered: {
    subject: 'Your order has been delivered ✅',
    emoji: '✅',
    message: 'Your order has been delivered. We hope you love your new jewellery! If you have any issues, please reach out to us on WhatsApp.',
  },
  cancelled: {
    subject: 'Your order has been cancelled ❌',
    emoji: '❌',
    message: 'Your order has been cancelled. If you have any questions, please contact us on WhatsApp at +91 80023 61934.',
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Sanity sends the full document in the webhook
    const order = body

    // Only send email for relevant status changes
    const statusInfo = STATUS_INFO[order.orderStatus]
    if (!statusInfo) {
      return NextResponse.json({ message: 'No email needed for this status' })
    }

    // Don't send if no customer email
    if (!order.customer?.email) {
      return NextResponse.json({ message: 'No customer email' })
    }

    const trackingHtml = order.trackingNumber ? `
      <div style="background: #f9f9f9; padding: 16px; margin: 20px 0; border-left: 3px solid #111;">
        <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 2px; color: #888;">TRACKING DETAILS</p>
        ${order.courierName ? `<p style="margin: 0 0 4px; font-size: 14px;">Courier: <strong>${order.courierName}</strong></p>` : ''}
        <p style="margin: 0 0 4px; font-size: 14px;">Tracking Number: <strong>${order.trackingNumber}</strong></p>
        ${order.trackingUrl ? `<a href="${order.trackingUrl}" style="color: #111; font-size: 14px;">Track your shipment →</a>` : ''}
      </div>
    ` : ''

    await resend.emails.send({
      from: 'BeJeweled <onboarding@resend.dev>',
      to: 'siddhidokania@gmail.com', // change to order.customer.email after custom domain
      subject: `${statusInfo.subject} — ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">

          <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #eee;">
            <h1 style="font-size: 28px; letter-spacing: 4px; margin: 0;">BeJeweled</h1>
            <p style="color: #888; font-size: 12px; letter-spacing: 2px; margin: 8px 0 0;">BY MEGHDOOT JEWELLERS</p>
          </div>

          <div style="padding: 30px 0; text-align: center;">
            <p style="font-size: 48px; margin: 0;">${statusInfo.emoji}</p>
            <h2 style="font-size: 22px; margin: 16px 0 8px;">Order Update</h2>
            <p style="font-size: 13px; letter-spacing: 2px; color: #888; margin: 0;">${order.orderNumber}</p>
          </div>

          <div style="padding: 20px; background: #f9f9f9; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 16px; margin: 0; line-height: 1.6;">
              Hi ${order.customer?.name},<br/>
              ${statusInfo.message}
            </p>
          </div>

          ${trackingHtml}

          <div style="margin-bottom: 24px;">
            <p style="font-size: 12px; letter-spacing: 2px; color: #888; margin: 0 0 12px;">ORDER SUMMARY</p>
            ${order.items?.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                <span style="font-size: 14px;">${item.productName} × ${item.quantity}</span>
                <span style="font-size: 14px;">₹${(item.priceAtOrder * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; font-weight: bold;">
              <span>Total</span>
              <span>₹${order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; background: #111; color: #fff; margin-bottom: 24px;">
            <p style="margin: 0 0 12px; font-size: 14px;">Track your order anytime</p>
            <a href="https://bejeweledbymdj.vercel.app/order/${order.orderNumber}"
               style="background: #fff; color: #111; padding: 10px 24px; text-decoration: none; font-size: 12px; letter-spacing: 2px;">
              VIEW ORDER STATUS
            </a>
          </div>

          <div style="text-align: center; color: #aaa; font-size: 12px; padding: 20px 0;">
            <p>Questions? WhatsApp us at +91 80023 61934</p>
            <p style="margin: 4px 0;">BeJeweled by Meghdoot Jewellers</p>
          </div>

        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Status update email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}