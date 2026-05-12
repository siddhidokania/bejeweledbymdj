import { client } from '@/lib/sanity'
import { Product } from '@/types'
import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ImageGallery'

async function getProduct(slug: string): Promise<Product> {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">
            {product.gender === 'women' ? "Women's" : "Men's"} · {product.subcategory}
          </p>
          <h1 className="text-3xl font-serif text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-900 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-400 mb-6">Weight: {product.weight}g</p>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {product.inStock ? (
            <button className="bg-gray-900 text-white px-8 py-4 text-sm tracking-widest hover:bg-gray-700 transition">
              ADD TO CART
            </button>
          ) : (
            <button disabled className="bg-gray-200 text-gray-400 px-8 py-4 text-sm tracking-widest cursor-not-allowed">
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}