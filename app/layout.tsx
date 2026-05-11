import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BeJeweled — Handcrafted Silver Jewellery',
    template: '%s | BeJeweled',
  },
  description: 'Shop handcrafted sterling silver jewellery for women and men. Rings, necklaces, earrings, bracelets and more. Made with love in India.',
  keywords: ['silver jewellery', 'handcrafted jewellery', 'sterling silver', 'silver rings', 'silver necklaces', 'silver earrings', 'Indian jewellery'],
  openGraph: {
    title: 'BeJeweled — Handcrafted Silver Jewellery',
    description: 'Shop handcrafted sterling silver jewellery for women and men.',
    url: 'https://bejeweled.in',
    siteName: 'BeJeweled',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeJeweled — Handcrafted Silver Jewellery',
    description: 'Shop handcrafted sterling silver jewellery for women and men.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}