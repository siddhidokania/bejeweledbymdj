import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Human-readable order ID (e.g. BJ-1001)',
      readOnly: true,
    }),
    defineField({
      name: 'accessToken',
      title: 'Access Token',
      type: 'string',
      description: 'Secret part of the customer\'s order-status link',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Order Date',
      type: 'datetime',
      readOnly: true,
    }),

    // ─── Customer Details ────────────────────────────────────────────
    defineField({
      name: 'customer',
      title: 'Customer Details',
      type: 'object',
      fields: [
        defineField({ name: 'name',  title: 'Full Name',    type: 'string' }),
        defineField({ name: 'email', title: 'Email',        type: 'string' }),
        defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
      ],
    }),

    // ─── Shipping Address ────────────────────────────────────────────
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({ name: 'line1',   title: 'Address Line 1', type: 'string' }),
        defineField({ name: 'line2',   title: 'Address Line 2 (optional)', type: 'string' }),
        defineField({ name: 'city',    title: 'City',           type: 'string' }),
        defineField({ name: 'state',   title: 'State',          type: 'string' }),
        defineField({ name: 'pincode', title: 'Pincode',        type: 'string' }),
      ],
    }),

    // ─── Order Items ─────────────────────────────────────────────────
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            }),
            defineField({ name: 'productName', title: 'Product Name (at time of order)', type: 'string' }),
            defineField({ name: 'quantity',    title: 'Quantity',                         type: 'number' }),
            defineField({ name: 'priceAtOrder', title: 'Price at Time of Order (₹)',      type: 'number' }),
          ],
          preview: {
            select: {
              title: 'productName',
              subtitle: 'quantity',
              price: 'priceAtOrder',
            },
            prepare({ title, subtitle, price }) {
              return {
                title: title || 'Unknown Product',
                subtitle: `Qty: ${subtitle} · ₹${price}`,
              }
            },
          },
        },
      ],
    }),

    // ─── Pricing ─────────────────────────────────────────────────────
    defineField({
      name: 'subtotal',
      title: 'Subtotal (₹)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'shippingFee',
      title: 'Shipping Fee (₹)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'discount',
      title: 'Discount (₹)',
      type: 'number',
      description: 'Amount discounted via coupon',
      initialValue: 0,
    }),
    defineField({
      name: 'couponCode',
      title: 'Coupon Code Applied',
      type: 'string',
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (₹)',
      type: 'number',
      readOnly: true,
    }),

    // ─── Payment ─────────────────────────────────────────────────────
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Razorpay (Online)', value: 'razorpay' },
          { title: 'Cash on Delivery', value: 'cod' },
        ],
        layout: 'radio',
      },
      initialValue: 'razorpay',
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Pending',   value: 'pending' },
          { title: '✅ Paid',      value: 'paid' },
          { title: '❌ Failed',    value: 'failed' },
          { title: '↩️ Refunded',  value: 'refunded' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'razorpayOrderId',
      title: 'Razorpay Order ID',
      type: 'string',
      description: 'Auto-filled after Razorpay integration',
    }),
    defineField({
      name: 'razorpayPaymentId',
      title: 'Razorpay Payment ID',
      type: 'string',
      description: 'Auto-filled after successful payment',
    }),

    // ─── Order Status & Shipping ──────────────────────────────────────
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: '📋 Processing',  value: 'processing' },
          { title: '📦 Packed',      value: 'packed' },
          { title: '🚚 Shipped',     value: 'shipped' },
          { title: '✅ Delivered',   value: 'delivered' },
          { title: '❌ Cancelled',   value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'processing',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Add this once the order is shipped',
    }),
    defineField({
      name: 'courierName',
      title: 'Courier / Shipping Partner',
      type: 'string',
      description: 'e.g. Delhivery, Shiprocket, Blue Dart',
    }),
    defineField({
      name: 'trackingUrl',
      title: 'Tracking URL',
      type: 'url',
      description: 'Direct link to tracking page for this shipment',
    }),

    // ─── Notes ───────────────────────────────────────────────────────
    defineField({
      name: 'deliveryNotes',
      title: 'Delivery Notes',
      type: 'text',
      rows: 2,
      description: 'Special instructions from the customer',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      rows: 2,
      description: 'Private notes for you(not visible to customer)',
    }),
  ],

  // ─── Studio Preview ─────────────────────────────────────────────────
  preview: {
    select: {
      orderNumber:   'orderNumber',
      customerName:  'customer.name',
      total:         'totalAmount',
      status:        'orderStatus',
      paymentStatus: 'paymentStatus',
    },
    prepare({ orderNumber, customerName, total, status, paymentStatus }) {
      const statusEmoji: Record<string, string> = {
        processing: '📋',
        packed:     '📦',
        shipped:    '🚚',
        delivered:  '✅',
        cancelled:  '❌',
      }
      return {
        title:    `${orderNumber || 'New Order'} — ${customerName || 'Unknown'}`,
        subtitle: `${statusEmoji[status] || ''} ${status || '—'} · ₹${total || 0} · Payment: ${paymentStatus || 'pending'}`,
      }
    },
  },

  // ─── Studio ordering ────────────────────────────────────────────────
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Order Number',
      name: 'orderNumberDesc',
      by: [{ field: 'orderNumber', direction: 'desc' }],
    },
  ],
})