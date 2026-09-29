import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private pages: admin, checkout flow, customer accounts and order details
      disallow: ['/studio/', '/api/', '/account', '/checkout', '/cart', '/order/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
