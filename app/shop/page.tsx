import { client } from '@/lib/sanity'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

async function getProducts(): Promise<Product[]> {
  return client.fetch(`*[_type == "product"] | order(_createdAt desc)`)
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Collection</p>
        <h1 className="text-4xl font-serif text-gray-900">All Pieces</h1>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-gray-400">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
