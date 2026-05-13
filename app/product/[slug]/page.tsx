import { client } from '@/lib/sanity'
import { Product } from '@/types'
import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ImageGallery'
import AddToCartButton from '@/components/AddToCartButton'

async function getProduct(slug: string): Promise<Product> {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return notFound()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
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
          <p className="text-sm text-gray-400 mb-6">Weight: {product.weight}g</p>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}