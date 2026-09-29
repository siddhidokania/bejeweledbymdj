import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function getOrder(orderNumber: string) {
  return readClient.fetch(
    `*[_type == "order" && orderNumber == $orderNumber][0]`,
    { orderNumber },
    { cache: 'no-store' }
  )
}

const STATUSES = ['processing', 'packed', 'shipped', 'delivered']

const STATUS_INFO: Record<string, { label: string; emoji: string; description: string }> = {
  processing: {
    label: 'Processing',
    emoji: '📋',
    description: 'We have received your order and are preparing it.',
  },
  packed: {
    label: 'Packed',
    emoji: '📦',
    description: 'Your order has been carefully packed and is ready to ship.',
  },
  shipped: {
    label: 'Shipped',
    emoji: '🚚',
    description: 'Your order is on its way to you!',
  },
  delivered: {
    label: 'Delivered',
    emoji: '✅',
    description: 'Your order has been delivered. Enjoy your jewellery!',
  },
}

// Order numbers are sequential (BJ-1001, BJ-1002…), so knowing one must not be enough to see
// someone's address. Allow access with the secret link token, or when signed in as the customer.
async function canViewOrder(order: { accessToken?: string; customer?: { email?: string } }, token?: string) {
  if (token && order.accessToken && token === order.accessToken) return true
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  return !!email && !!order.customer?.email && email.toLowerCase() === order.customer.email.toLowerCase()
}

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { orderNumber } = await params
  const { t: token } = await searchParams
  const order = await getOrder(orderNumber)

  // Same response whether the order doesn't exist or isn't theirs, so order numbers can't be probed
  if (!order || !(await canViewOrder(order, token))) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h1 className="text-3xl font-serif text-gray-900 mb-4">View Your Order</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Please use the link from your order confirmation email, or sign in with the email address you used to place the order.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={`/sign-in?redirect_url=${encodeURIComponent(`/order/${orderNumber}`)}`} className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition">
            SIGN IN
          </Link>
          <Link href="/contact" className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-100 transition">
            NEED HELP?
          </Link>
        </div>
      </div>
    )
  }

  const currentStatusIndex = STATUSES.indexOf(order.orderStatus)
  const isCancelled = order.orderStatus === 'cancelled'

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Order Confirmed</p>
        <h1 className="text-4xl font-serif text-gray-900 mb-2">{order.orderNumber}</h1>
        <p className="text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
      </div>

      {/* Status Timeline */}
      {!isCancelled ? (
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-gray-900 z-0 transition-all duration-500"
              style={{
                width: currentStatusIndex === -1 ? '0%' :
                  `${(currentStatusIndex / (STATUSES.length - 1)) * 100}%`
              }}
            />
            {STATUSES.map((status, index) => {
              const info = STATUS_INFO[status]
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex
              return (
                <div key={status} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition ${
                    isCompleted
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-300'
                  }`}>
                    {info.emoji}
                  </div>
                  <p className={`text-xs font-medium text-center ${
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {info.label}
                  </p>
                </div>
              )
            })}
          </div>
          {order.orderStatus && STATUS_INFO[order.orderStatus] && (
            <div className="mt-8 text-center bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                {STATUS_INFO[order.orderStatus].description}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-12 text-center bg-red-50 p-6">
          <p className="text-2xl mb-2">❌</p>
          <p className="font-medium text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-500 mt-1">This order has been cancelled.</p>
        </div>
      )}

      {/* Tracking Info */}
      {order.trackingNumber && (
        <div className="mb-8 border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Tracking Information</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            {order.courierName && (
              <p>Courier: <span className="text-gray-900">{order.courierName}</span></p>
            )}
            <p>Tracking Number: <span className="text-gray-900 font-medium">{order.trackingNumber}</span></p>
            {order.trackingUrl && (
              
            <a    href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Track your shipment →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Customer Details</h2>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <p>{order.customer?.name}</p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
          </div>
        </div>
        <div className="border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Shipping Address</h2>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <p>{order.shippingAddress?.line1}</p>
            {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            <p>{order.shippingAddress?.pincode}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-lg font-serif text-gray-900 mb-4">Order Items</h2>
        <div className="flex flex-col gap-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">₹{(item.priceAtOrder * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-gray-50 p-6 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <p className="text-gray-600">Subtotal</p>
          <p>₹{order.subtotal?.toLocaleString('en-IN')}</p>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm mb-2">
            <p className="text-gray-600">Discount {order.couponCode && `(${order.couponCode})`}</p>
            <p className="text-green-600">-₹{order.discount?.toLocaleString('en-IN')}</p>
          </div>
        )}
        <div className="flex justify-between text-sm mb-2">
          <p className="text-gray-600">Shipping</p>
          <p className="text-green-600">Free</p>
        </div>
        <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-2">
          <p>Total</p>
          <p>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <p className="text-gray-600">Payment Method</p>
          <p className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <p className="text-gray-600">Payment Status</p>
          <p className={`capitalize font-medium ${
            order.paymentStatus === 'paid' ? 'text-green-600' :
            order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link href="/shop" className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-900 hover:text-white transition">
          CONTINUE SHOPPING
        </Link>
        <Link href="/account" className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition">
          MY ORDERS
        </Link>
      </div>
    </div>
  )
}