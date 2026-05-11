'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif tracking-widest text-gray-900">
          BeJeweled
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link href="/shop" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">
            Shop
          </Link>
          <Link href="/about" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">
            About
          </Link>
          <Link href="/contact" className="text-sm tracking-wide text-gray-600 hover:text-gray-900 transition">
            Contact
          </Link>
        </div>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
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
        </div>
      )}
    </nav>
  )
}