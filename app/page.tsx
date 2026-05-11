import Link from 'next/link'
import { client } from '@/lib/sanity'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

async function getFeaturedProducts(): Promise<Product[]> {
  const products = await client.fetch(`*[_type == "product" && featured == true][0...4]`)
  console.log('Featured products:', products)
  return products
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 bg-[#faf9f7]">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-4">Handcrafted Silver Jewellery</p>
        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-6 leading-tight">
          Wear Your <br /> Story
        </h1>
        <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
          Each piece is thoughtfully crafted in sterling silver — timeless designs for everyday elegance.
        </p>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition"
          >
            SHOP NOW
          </Link>
          <Link
            href="/about"
            className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-100 transition"
          >
            OUR STORY
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Handpicked</p>
            <h2 className="text-3xl font-serif text-gray-900">Featured Pieces</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-900 hover:text-white transition"
            >
              VIEW ALL
            </Link>
          </div>
        </section>
      )}

      {/* Brand Values */}
      <section className="bg-[#faf9f7] py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-2xl mb-3">✦</div>
            <h3 className="font-serif text-lg mb-2">Handcrafted</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Every piece is made by hand with love and attention to detail.</p>
          </div>
          <div>
            <div className="text-2xl mb-3">✦</div>
            <h3 className="font-serif text-lg mb-2">Pure Silver</h3>
            <p className="text-sm text-gray-500 leading-relaxed">We use only 925 sterling silver — built to last a lifetime.</p>
          </div>
          <div>
            <div className="text-2xl mb-3">✦</div>
            <h3 className="font-serif text-lg mb-2">Made with Love</h3>
            <p className="text-sm text-gray-500 leading-relaxed">A small brand with a big heart — your support means everything.</p>
          </div>
        </div>
      </section>
    </div>
  )
}