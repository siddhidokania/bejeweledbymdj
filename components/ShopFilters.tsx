'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES = [
  'Rings', 'Necklaces', 'Earrings', 'Bracelets',
  'Pendants', 'Anklets', 'Bangles', 'Chains', 'Cufflinks'
]

export default function ShopFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeGender = searchParams.get('gender') || ''
  const activeCategory = searchParams.get('category') || ''

  function applyFilter(gender: string, category: string) {
    const params = new URLSearchParams()
    if (gender) params.set('gender', gender)
    if (category) params.set('category', category)
    router.push(`/shop?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/shop')
  }

  return (
    <div className="flex flex-wrap gap-3 mb-10 items-center">

      {/* Gender Filter */}
      <div className="flex gap-2">
        {["Women's", "Men's"].map((g) => {
          const val = g === "Women's" ? 'women' : 'men'
          return (
            <button
              key={g}
              onClick={() => applyFilter(activeGender === val ? '' : val, activeCategory)}
              className={`px-4 py-2 text-sm border transition ${
                activeGender === val
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
              }`}
            >
              {g}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 hidden md:block" />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const val = cat.toLowerCase()
          return (
            <button
              key={cat}
              onClick={() => applyFilter(activeGender, activeCategory === val ? '' : val)}
              className={`px-4 py-2 text-sm border transition ${
                activeCategory === val
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Clear Filters */}
      {(activeGender || activeCategory) && (
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 hover:text-red-700 underline ml-2"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}