import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await client.fetch(`*[_type == "product"]{ slug, _updatedAt }`)

  const productUrls = products.map((product: any) => ({
    url: `https://bejeweled.in/product/${product.slug.current}`,
    lastModified: new Date(product._updatedAt),
  }))

  return [
    { url: 'https://bejeweled.in', lastModified: new Date() },
    { url: 'https://bejeweled.in/shop', lastModified: new Date() },
    { url: 'https://bejeweled.in/about', lastModified: new Date() },
    { url: 'https://bejeweled.in/contact', lastModified: new Date() },
    ...productUrls,
  ]
}