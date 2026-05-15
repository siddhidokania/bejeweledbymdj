import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { generateOrderNumber } from '@/lib/generateOrderNumber'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      discount,
      couponCode,
      totalAmount,
      paymentMethod,
      deliveryNotes,
    } = body

    // Validate required fields
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: 'Missing customer details' }, { status: 400 })
    }
    if (!shippingAddress?.line1 || !shippingAddress?.pincode) {
      return NextResponse.json({ error: 'Missing shipping address' }, { status: 400 })
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    const orderNumber = await generateOrderNumber()

    const order = await writeClient.create({
      _type: 'order',
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      shippingAddress,
      items: items.map((item: any) => ({
        _key: crypto.randomUUID(),
        product: { _type: 'reference', _ref: item.productId },
        productName: item.name,
        quantity: item.quantity,
        priceAtOrder: item.price,
      })),
      subtotal,
      discount: discount || 0,
      couponCode: couponCode || '',
      totalAmount,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      deliveryNotes: deliveryNotes || '',
    })

    return NextResponse.json({ success: true, orderId: order._id, orderNumber })
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}