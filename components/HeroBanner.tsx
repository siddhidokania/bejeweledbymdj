'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { Banner } from '@/types'

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) return null

  const banner = banners[current]

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Banner Image */}
      <Image
        src={urlFor(banner.image).width(1600).height(900).url()}
        alt={banner.title}
        fill
        className="object-cover transition-opacity duration-700"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xs tracking-[0.3em] text-white/70 uppercase mb-4">
          BeJeweled
        </p>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
          {banner.title}
        </h1>
        {banner.subtitle && (
          <p className="text-white/80 text-lg mb-8 max-w-md">
            {banner.subtitle}
          </p>
        )}
        {banner.buttonText && banner.buttonLink && (
          <Link
            href={banner.buttonLink}
            className="bg-white text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-100 transition"
          >
            {banner.buttonText.toUpperCase()}
          </Link>
        )}
      </div>

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrow Navigation (if multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 transition"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 transition"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}