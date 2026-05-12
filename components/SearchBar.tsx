'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Product } from '@/types'

const SUGGESTIONS = [
  'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants', 'Anklets', 'Bangles', 'Chains', 'Cufflinks',
  "Women's Rings", "Women's Necklaces", "Women's Earrings", "Women's Bracelets", "Women's Anklets",
  "Men's Rings", "Men's Bracelets", "Men's Chains", "Men's Cufflinks",
  'Silver Ring', 'Silver Necklace', 'Silver Earring', 'Silver Bracelet', 'Silver Anklet',
]

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search + suggestions as user types
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setSuggestions([])
      setOpen(false)
      return
    }

    // Filter suggestions
    const filtered = SUGGESTIONS.filter(s =>
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4)
    setSuggestions(filtered)

    const timeout = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  function handleSelect(slug: string) {
    setQuery('')
    setOpen(false)
    router.push(`/product/${slug}`)
  }

  function handleSuggestion(suggestion: string) {
    setQuery('')
    setOpen(false)
    router.push(`/shop?search=${encodeURIComponent(suggestion)}`)
  }

  function handleSearch() {
    if (query.length < 2) return
    setOpen(false)
    router.push(`/shop?search=${encodeURIComponent(query)}`)
    setQuery('')
  }

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      {/* Search Input */}
      <div className="flex items-center border border-gray-200 bg-gray-50 px-3 py-2 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search jewellery..."
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl z-50 max-h-96 overflow-y-auto">

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs tracking-widest text-gray-400 uppercase">Suggestions</p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          {suggestions.length > 0 && results.length > 0 && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* Products */}
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs tracking-widest text-gray-400 uppercase">Products</p>
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSelect(product.slug.current)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {product.images?.[0] && (
                      <Image
                        src={urlFor(product.images[0]).width(100).height(100).url()}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{product.gender}'s · {product.subcategory}</p>
                    <p className="text-xs text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 && !loading && suggestions.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No results for "{query}"</div>
          ) : null}

        </div>
      )}
    </div>
  )
}