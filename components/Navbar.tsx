'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import SearchBar from './SearchBar'
import { useCart } from '@/lib/cartContext'
import Image from 'next/image'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/splash.png"
            alt="BeJeweled"
            width={130}
            height={10}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">Home</Link>
          <Link href="/shop" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">Shop</Link>
          <Link href="/about" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">About</Link>
          <Link href="/contact" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">Contact</Link>
        </div>

        {/* Search + Cart */}
        <div className="hidden md:flex items-center gap-4">
          <SearchBar />
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition flex-shrink-0 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-gray-600 hover:text-gray-900">Shop</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide text-gray-600 hover:text-gray-900">Contact</Link>
          <SearchBar />
        </div>
      )}
    </nav>
  )
}