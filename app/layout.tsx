import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cartContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import AnnouncementBar from '@/components/AnnouncementBar'
import { client } from '@/lib/sanity'
import { ClerkProvider } from '@clerk/nextjs'
import { SITE_URL } from '@/lib/site'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BeJeweled — Handcrafted Silver Jewellery',
    template: '%s | BeJeweled',
  },
  description: 'Shop handcrafted sterling silver jewellery for women and men. Rings, necklaces, earrings, bracelets and more. Made with love in India.',
  keywords: ['silver jewellery', 'handcrafted jewellery', 'sterling silver', 'silver rings', 'silver necklaces', 'silver earrings', 'Indian jewellery'],
  verification: {
    google: 'ADKsBbLHlJw_4pHVK2yaTRFzgagbwPFV06Q-yyoLEoo',
  },
  openGraph: {
    title: 'BeJeweled — Handcrafted Silver Jewellery',
    description: 'Shop handcrafted sterling silver jewellery for women and men.',
    url: SITE_URL,
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

async function getAnnouncement() {
  return client.fetch(
    `*[_type == "announcement" && active == true][0]{
      message, linkText, linkUrl, bgColor
    }`,
    {},
    { cache: 'no-store' }
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const announcement = await getAnnouncement()

  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900`}>
        <ClerkProvider>
          <CartProvider>
            <div className="fixed top-0 left-0 right-0 z-50">
              {announcement && (
                <AnnouncementBar
                  message={announcement.message}
                  linkText={announcement.linkText}
                  linkUrl={announcement.linkUrl}
                  bgColor={announcement.bgColor}
                />
              )}
              <Navbar />
            </div>
            <main className="pt-24">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}