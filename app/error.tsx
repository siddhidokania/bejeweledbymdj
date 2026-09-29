'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-4">Something Went Wrong</p>
      <h1 className="text-4xl font-serif text-gray-900 mb-4">We couldn&apos;t load this page</h1>
      <p className="text-gray-500 mb-10 leading-relaxed">
        Please try again in a moment. If it keeps happening, message us on WhatsApp and we&apos;ll help right away.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => unstable_retry()}
          className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition"
        >
          TRY AGAIN
        </button>
        <Link href="/" className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-100 transition">
          GO HOME
        </Link>
      </div>
    </div>
  )
}
