'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cartContext'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getShippingFee, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    deliveryNotes: '',
    paymentMethod: 'cod',
  })

  // Update form when user loads
  if (isLoaded && user && !form.name) {
    setForm(prev => ({
      ...prev,
      name: user.fullName || '',
      email: user.primaryEmailAddress?.emailAddress || '',
    }))
  }

  const shippingFee = getShippingFee(totalPrice)
  const finalTotal = totalPrice + shippingFee

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          // Only IDs + quantities — the server looks up the real prices
          items: items.map(item => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          expectedTotal: finalTotal,
          paymentMethod: form.paymentMethod,
          deliveryNotes: form.deliveryNotes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      clearCart()
      router.push(`/order/${data.orderNumber}`)
    } catch (err) {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🛍️</p>
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/shop" className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition">
          SHOP NOW
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Almost There</p>
        <h1 className="text-4xl font-serif text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left — Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Customer Details */}
          <div>
            <h2 className="text-lg font-serif text-gray-900 mb-4">Contact Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Full Name *</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Phone *</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-lg font-serif text-gray-900 mb-4">Shipping Address</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Address Line 1 *</label>
                <input
                  name="line1"
                  required
                  value={form.line1}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                  placeholder="House/Flat no, Street name"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Address Line 2</label>
                <input
                  name="line2"
                  value={form.line2}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                  placeholder="Landmark, Area (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">City *</label>
                  <input
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Pincode *</label>
                  <input
                    name="pincode"
                    required
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">State *</label>
                <select
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition bg-white"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="text-xs tracking-widest text-gray-400 uppercase block mb-1">Delivery Notes (optional)</label>
            <textarea
              name="deliveryNotes"
              value={form.deliveryNotes}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 transition resize-none"
              placeholder="Any special instructions for delivery..."
            />
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-serif text-gray-900 mb-4">Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className={`flex items-center gap-3 border p-4 cursor-pointer transition ${form.paymentMethod === 'cod' ? 'border-gray-900' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="accent-gray-900"
                />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Pay when your order arrives</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 border p-4 cursor-pointer transition ${form.paymentMethod === 'razorpay' ? 'border-gray-900' : 'border-gray-200'} opacity-50`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={form.paymentMethod === 'razorpay'}
                  onChange={handleChange}
                  disabled
                  className="accent-gray-900"
                />
                <div>
                  <p className="text-sm font-medium">Online Payment (Razorpay)</p>
                  <p className="text-xs text-gray-400">Coming soon — UPI, Cards, Net Banking</p>
                </div>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest hover:bg-gray-700 transition disabled:bg-gray-400"
          >
            {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
          </button>
        </form>

        {/* Right — Order Summary */}
        <div>
          <h2 className="text-lg font-serif text-gray-900 mb-6">Order Summary</h2>
          <div className="bg-gray-50 p-6">
            {/* Items */}
            <div className="flex flex-col gap-4 mb-6">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p>₹{totalPrice.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Shipping</p>
                <p className={shippingFee === 0 ? 'text-green-600' : ''}>
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                </p>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gray-400">Free shipping on orders above ₹{FREE_SHIPPING_THRESHOLD}</p>
              )}
              <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-2">
                <p>Total</p>
                <p>₹{finalTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}