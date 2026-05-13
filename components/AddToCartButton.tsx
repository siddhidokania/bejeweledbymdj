'use client'

import { useCart } from '@/lib/cartContext'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] ? urlFor(product.images[0]).width(200).height(200).url() : '',
      slug: product.slug.current,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product.inStock) {
    return (
      <button disabled className="bg-gray-200 text-gray-400 px-8 py-4 text-sm tracking-widest cursor-not-allowed w-full">
        OUT OF STOCK
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`px-8 py-4 text-sm tracking-widest transition w-full ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-gray-900 text-white hover:bg-gray-700'
      }`}
    >
      {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
    </button>
  )
}