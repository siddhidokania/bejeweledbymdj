import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products: { slug?: { current?: string }; _updatedAt: string }[] =
    await client.fetch(`*[_type == "product" && defined(slug.current)]{ slug, _updatedAt }`)

  const productUrls = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug!.current}`,
    lastModified: new Date(product._updatedAt),
  }))

  return [
    { url: SITE_URL, lastModified: new Date() },
    ...['/shop', '/about', '/contact', '/returns'].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })),
    ...productUrls,
  ]
}
