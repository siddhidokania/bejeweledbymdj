'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Order {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  items: {
    productName: string
    quantity: number
    priceAtOrder: number
  }[]
}

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-800',
  packed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_EMOJI: Record<string, string> = {
  processing: '📋',
  packed: '📦',
  shipped: '🚚',
  delivered: '✅',
  cancelled: '❌',
}

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
      return
    }
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchOrders(user.primaryEmailAddress.emailAddress)
    }
  }, [isLoaded, user])

  async function fetchOrders(email: string) {
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">My Account</p>
        <h1 className="text-4xl font-serif text-gray-900">Welcome back!</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-50 p-6 mb-10 flex items-center gap-6">
        {user.imageUrl && (
          <Image
            src={user.imageUrl}
            alt={user.fullName || 'User'}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-900">{user.fullName || 'No name set'}</h2>
          <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <button
          onClick={() => signOut(() => router.push('/'))}
          className="text-sm text-red-500 hover:text-red-700 transition border border-red-200 px-4 py-2 hover:border-red-400"
        >
          Sign Out
        </button>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="text-xl font-serif text-gray-900 mb-6">Your Orders</h2>

        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 border border-gray-100">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition"
            >
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/order/${order.orderNumber}`}
                className="border border-gray-100 p-6 hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${STATUS_STYLES[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_EMOJI[order.orderStatus]} {order.orderStatus}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {order.items?.map((item, i) => (
                    <p key={i} className="text-sm text-gray-500">
                      {item.productName} × {item.quantity} — ₹{item.priceAtOrder?.toLocaleString('en-IN')}
                    </p>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}