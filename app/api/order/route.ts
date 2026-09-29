import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { generateOrderNumber } from '@/lib/generateOrderNumber'
import { Resend } from 'resend'
import { getShippingFee, MAX_QUANTITY_PER_ITEM } from '@/lib/pricing'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const resend = new Resend(process.env.RESEND_API_KEY)

interface PricedItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customer,
      shippingAddress,
      items: requestedItems,
      expectedTotal,
      paymentMethod,
      deliveryNotes,
    } = body

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: 'Missing customer details' }, { status: 400 })
    }
    if (!shippingAddress?.line1 || !shippingAddress?.pincode) {
      return NextResponse.json({ error: 'Missing shipping address' }, { status: 400 })
    }
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }
    // Online payment isn't live yet, so COD is the only accepted method
    if (paymentMethod !== 'cod') {
      return NextResponse.json({ error: 'Only Cash on Delivery is available right now' }, { status: 400 })
    }

    // Merge duplicate lines and validate quantities
    const quantities = new Map<string, number>()
    for (const item of requestedItems) {
      const qty = Number(item?.quantity)
      if (typeof item?.productId !== 'string' || !Number.isInteger(qty) || qty < 1) {
        return NextResponse.json({ error: 'Invalid item in cart' }, { status: 400 })
      }
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + qty)
    }

    // Prices always come from Sanity — never from the browser
    const products: { _id: string; name: string; price: number; inStock?: boolean; stock?: number | null }[] =
      await writeClient.fetch(
        `*[_type == "product" && _id in $ids && !(_id in path("drafts.**"))]{ _id, name, price, inStock, stock }`,
        { ids: [...quantities.keys()] }
      )
    const productMap = new Map(products.map(p => [p._id, p]))

    const items: PricedItem[] = []
    for (const [productId, quantity] of quantities) {
      const product = productMap.get(productId)
      if (!product) {
        return NextResponse.json({ error: 'An item in your cart is no longer available. Please remove it and try again.' }, { status: 409 })
      }
      if (product.inStock === false || product.stock === 0) {
        return NextResponse.json({ error: `${product.name} is out of stock. Please remove it from your cart.` }, { status: 409 })
      }
      const maxQty = Math.min(MAX_QUANTITY_PER_ITEM, product.stock ?? MAX_QUANTITY_PER_ITEM)
      if (quantity > maxQty) {
        return NextResponse.json({ error: `Only ${maxQty} of ${product.name} can be ordered.` }, { status: 409 })
      }
      items.push({ productId, name: product.name, quantity, price: product.price })
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shippingFee = getShippingFee(subtotal)
    const totalAmount = subtotal + shippingFee

    // If prices changed since the customer loaded their cart, make them review before charging a different amount
    if (Number(expectedTotal) !== totalAmount) {
      return NextResponse.json(
        { error: `Prices have changed since you added these items. Your new total is ₹${totalAmount.toLocaleString('en-IN')} — please review your cart.`, code: 'PRICE_CHANGED' },
        { status: 409 }
      )
    }

    const orderNumber = await generateOrderNumber()

    const order = await writeClient.create({
      _type: 'order',
      _id: `order.${orderNumber.toLowerCase()}.${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      shippingAddress,
      items: items.map((item) => ({
        _key: crypto.randomUUID(),
        product: { _type: 'reference', _ref: item.productId },
        productName: item.name,
        quantity: item.quantity,
        priceAtOrder: item.price,
      })),
      subtotal,
      shippingFee,
      discount: 0,
      couponCode: '',
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      deliveryNotes: deliveryNotes || '',
    })

    // Send order confirmation email
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${item.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')

    await resend.emails.send({
      from: 'BeJeweled <onboarding@resend.dev>',
      to: 'siddhidokania@gmail.com', // until custom domain
      subject: `Order Confirmed — ${orderNumber} 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          
          <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #eee;">
            <h1 style="font-size: 28px; letter-spacing: 4px; margin: 0;">BeJeweled</h1>
            <p style="color: #888; font-size: 12px; letter-spacing: 2px; margin: 8px 0 0;">BY MEGHDOOT JEWELLERS</p>
          </div>

          <div style="padding: 30px 0; text-align: center;">
            <p style="font-size: 12px; letter-spacing: 3px; color: #888; text-transform: uppercase;">Order Confirmed</p>
            <h2 style="font-size: 24px; margin: 8px 0;">${orderNumber}</h2>
            <p style="color: #555;">Thank you, ${customer.name}! Your order has been received.</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding-bottom: 8px; font-size: 12px; letter-spacing: 1px; color: #888;">ITEM</th>
                  <th style="text-align: center; padding-bottom: 8px; font-size: 12px; letter-spacing: 1px; color: #888;">QTY</th>
                  <th style="text-align: right; padding-bottom: 8px; font-size: 12px; letter-spacing: 1px; color: #888;">PRICE</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: #555; font-size: 14px;">Subtotal</span>
                <span style="font-size: 14px;">₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: #555; font-size: 14px;">Shipping</span>
                ${shippingFee === 0
                  ? '<span style="color: #16a34a; font-size: 14px;">Free</span>'
                  : `<span style="font-size: 14px;">₹${shippingFee.toLocaleString('en-IN')}</span>`}
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                <span style="font-weight: bold;">Total</span>
                <span style="font-weight: bold;">₹${totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style="margin-top: 8px;">
                <span style="color: #555; font-size: 13px;">Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="padding: 16px; border: 1px solid #eee;">
              <p style="font-size: 11px; letter-spacing: 2px; color: #888; margin: 0 0 8px;">SHIPPING TO</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                ${customer.name}<br/>
                ${shippingAddress.line1}${shippingAddress.line2 ? '<br/>' + shippingAddress.line2 : ''}<br/>
                ${shippingAddress.city}, ${shippingAddress.state}<br/>
                ${shippingAddress.pincode}
              </p>
            </div>
            <div style="padding: 16px; border: 1px solid #eee;">
              <p style="font-size: 11px; letter-spacing: 2px; color: #888; margin: 0 0 8px;">CONTACT</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                ${customer.email}<br/>
                ${customer.phone}
              </p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; background: #111; color: #fff; margin-bottom: 24px;">
            <p style="margin: 0 0 12px; font-size: 14px;">Track your order anytime</p>
            <a href="https://bejeweledbymdj.vercel.app/order/${orderNumber}" 
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

    return NextResponse.json({ success: true, orderId: order._id, orderNumber })
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}