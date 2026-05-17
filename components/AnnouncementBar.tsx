'use client'

import Link from 'next/link'
import { useState } from 'react'

const colorMap: Record<string, string> = {
  'bg-gray-900': '#111827',
  'bg-amber-600': '#d97706',
  'bg-rose-500': '#f43f5e',
  'bg-blue-900': '#2a3b5d',
  'bg-emerald-700': '#047857',
}

interface Props {
  message: string
  linkText?: string
  linkUrl?: string
  bgColor?: string
}

export default function AnnouncementBar({ message, linkText, linkUrl, bgColor = 'bg-gray-900' }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const backgroundColor = colorMap[bgColor] ?? '#111827'

  return (
    <div
      style={{ backgroundColor }}
      className="text-white text-xs py-2.5 px-4 text-center relative"
    >
      <p className="tracking-wide">
        {message}
        {linkText && linkUrl && (
          <Link
            href={linkUrl}
            className="ml-2 underline underline-offset-2 font-semibold hover:opacity-80 transition"
          >
            {linkText} →
          </Link>
        )}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition text-base leading-none"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}