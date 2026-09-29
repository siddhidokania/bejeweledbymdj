'use client'

import { useCart } from '@/lib/cartContext'
import Image from 'next/image'
import Link from 'next/link'
import { getShippingFee, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()
  const shippingFee = getShippingFee(totalPrice)

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🛍️</p>
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition">
          SHOP NOW
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-gray-900">Your Cart</h1>
        <p className="text-gray-400 mt-2">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border-b border-gray-100 pb-6">
            {/* Image */}
            <Link href={`/product/${item.slug}`}>
              <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} width={200} height={200} className="w-full h-full object-cover" />
                )}
              </div>
            </Link>

            {/* Details */}
            <div className="flex-1">
              <Link href={`/product/${item.slug}`}>
                <h3 className="text-sm font-medium text-gray-900 hover:underline">{item.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">₹{item.price.toLocaleString('en-IN')}</p>

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 transition"
                >
                  −
                </button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item Total + Remove */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              <button
                onClick={() => removeItem(item._id)}
                className="text-xs text-red-400 hover:text-red-600 mt-2 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6">
        <div className="flex justify-between mb-3">
          <p className="text-sm text-gray-600">Subtotal ({totalItems} items)</p>
          <p className="text-sm font-medium">₹{totalPrice.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-sm text-gray-600">Shipping</p>
          <p className={`text-sm ${shippingFee === 0 ? 'text-green-600' : ''}`}>
            {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
          </p>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-gray-400 mb-2">
            Add ₹{(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString('en-IN')} more for free shipping
          </p>
        )}
        <div className="flex justify-between border-t border-gray-200 pt-4 mt-4 mb-6">
          <p className="font-medium">Total</p>
          <p className="font-medium">₹{(totalPrice + shippingFee).toLocaleString('en-IN')}</p>
        </div>

        <Link href="/checkout" className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest hover:bg-gray-700 transition mb-3 block text-center">
          PROCEED TO CHECKOUT
        </Link>
        <button onClick={clearCart} className="w-full border border-gray-200 py-3 text-sm text-gray-500 hover:border-gray-900 transition">
          Clear Cart
        </button>
      </div>
    </div>
  )
}