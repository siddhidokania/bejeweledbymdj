'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { MAX_QUANTITY_PER_ITEM } from '@/lib/pricing'

export interface CartItem {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
  quantity: number
  maxQuantity?: number // from stock when added; the server re-checks at checkout
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function maxFor(item: CartItem): number {
  return Math.min(MAX_QUANTITY_PER_ITEM, item.maxQuantity ?? MAX_QUANTITY_PER_ITEM)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bejeweled-cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('bejeweled-cart', JSON.stringify(items))
  }, [items])

  function addItem(item: CartItem) {
    setItems(prev => {
      const existing = prev.find(i => i._id === item._id)
      if (existing) {
        // Refresh the limit with the latest stock we saw
        const updated = { ...existing, maxQuantity: item.maxQuantity }
        return prev.map(i =>
          i._id === item._id ? { ...updated, quantity: Math.min(existing.quantity + 1, maxFor(updated)) } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i._id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return removeItem(id)
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: Math.min(quantity, maxFor(i)) } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}