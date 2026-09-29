import { client } from '@/lib/sanity'
import { Product, Review } from '@/types'
import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ImageGallery'
import AddToCartButton from '@/components/AddToCartButton'
import ProductCard from '@/components/ProductCard'
import ProductReviews from '@/components/ProductReviews'
import Link from 'next/link'
import type { Metadata } from 'next'
import { cache } from 'react'
import { urlFor } from '@/lib/sanity'
import { SITE_URL } from '@/lib/site'

// cache() so generateMetadata and the page share one Sanity request
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0]{
    _id, name, slug, price, originalPrice, weight, gender, subcategory,
    images, description, inStock, featured, stock
  }`, { slug })
})

function describe(product: Product): string {
  const base = product.description?.trim()
    || `Handcrafted 925 sterling silver ${product.subcategory} for ${product.gender === 'women' ? 'women' : 'men'}.`
  return base.length > 155 ? `${base.slice(0, 152).trimEnd()}…` : base
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product not found' }

  const description = describe(product)
  const image = product.images?.[0] ? urlFor(product.images[0]).width(1200).height(1200).fit('crop').url() : undefined

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title: `${product.name} | BeJeweled`,
      description,
      url: `/product/${slug}`,
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 1200, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | BeJeweled`,
      description,
      images: image ? [image] : undefined,
    },
  }
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  return client.fetch(
    `*[_type == "product" && slug.current != $slug && (subcategory == $subcategory || gender == $gender)][0...4]{
      _id, name, slug, price, originalPrice, weight, gender, subcategory,
      images, description, inStock, featured, stock
    }`,
    {
      slug: product.slug.current,
      subcategory: product.subcategory,
      gender: product.gender,
    }
  )
}

async function getReviews(productId: string): Promise<Review[]> {
  return client.fetch(
    `*[_type == "review" && product._ref == $productId && approved == true] | order(createdAt desc)`,
    { productId }
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return notFound()

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product),
    getReviews(product._id),
  ])

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const isOutOfStock = (product.stock !== null && product.stock !== undefined && product.stock === 0) || product.inStock === false
  const isLowStock = product.stock !== undefined && product.stock !== null && product.stock > 0 && product.stock <= 5

  // Structured data so Google can show price and availability in search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: describe(product),
    image: product.images?.slice(0, 4).map((img) => urlFor(img).width(1200).url()),
    sku: product._id,
    brand: { '@type': 'Brand', name: 'BeJeweled' },
    material: '925 Sterling Silver',
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
      },
    }),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug.current}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        // Escape "<" so product text can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ImageGallery images={product.images} name={product.name} />
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">
            {product.gender === 'women' ? "Women's" : "Men's"} · {product.subcategory}
          </p>
          <h1 className="text-3xl font-serif text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-2">
            <p className="text-2xl text-gray-900 font-medium">₹{product.price.toLocaleString('en-IN')}</p>
            {product.originalPrice && (
              <>
                <p className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                <p className="text-sm text-red-500 font-medium">{discount}% off</p>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-4">Weight: {product.weight}g</p>

          {/* Stock Badge */}
          {isOutOfStock && (
            <p className="text-sm font-semibold text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full mb-4 w-fit">
              Out of Stock
            </p>
          )}
          {isLowStock && (
            <p className="text-sm font-semibold text-red-500 bg-red-50 inline-block px-3 py-1 rounded-full mb-4 w-fit">
              ⚠️ Only {product.stock} left — order soon!
            </p>
          )}

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <AddToCartButton product={product} disabled={isOutOfStock} />
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-24">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">You May Also Like</p>
            <h2 className="text-3xl font-serif text-gray-900">Related Pieces</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-900 hover:text-white transition"
            >
              VIEW ALL
            </Link>
          </div>
        </div>
      )}

      {/* Reviews */}
      <ProductReviews reviews={reviews} productId={product._id} />
    </div>
  )
}