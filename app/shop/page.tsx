import { client } from '@/lib/sanity'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { Suspense } from 'react'
import ShopFilters from '@/components/ShopFilters'

async function getProducts(search?: string, gender?: string, category?: string): Promise<Product[]> {
  let filter = `_type == "product"`
  const params: Record<string, string> = {}

  if (gender) {
    filter += ` && gender == $gender`
    params.gender = gender
  }

  if (category) {
    filter += ` && subcategory == $category`
    params.category = category
  }

  if (search && search.length >= 2) {
    const words = search.trim().split(/\s+/)
    const searchFilter = words.map((_: string, i: number) => `
      name match $word${i} ||
      subcategory match $word${i} ||
      description match $word${i} ||
      gender match $word${i}
    `).join(' || ')
    filter += ` && (${searchFilter})`
    words.forEach((word: string, i: number) => {
      params[`word${i}`] = `${word}*`
    })
  }

  return client.fetch(
    `*[${filter}] | order(_createdAt desc)`,
    params
  )
}

async function getSuggestions(): Promise<Product[]> {
  return client.fetch(`*[_type == "product"] | order(_createdAt desc)[0...4]`)
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, gender?: string, category?: string }>
}) {
  const { search, gender, category } = await searchParams
  const products = await getProducts(search, gender, category)
  const suggestions = search && products.length === 0 ? await getSuggestions() : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Collection</p>
        {search ? (
          <h1 className="text-4xl font-serif text-gray-900">Results for "{search}"</h1>
        ) : (
          <h1 className="text-4xl font-serif text-gray-900">All Pieces</h1>
        )}
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <ShopFilters />
      </Suspense>

      {/* Results */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🪙</p>
          <h2 className="text-2xl font-serif text-gray-900 mb-2">
            {search ? "Uh oh! We don't have what you're looking for" : "No products found"}
          </h2>
          <p className="text-gray-400 mb-12">
            {search
              ? `We couldn't find anything for "${search}", but you might like these!`
              : "Try clearing the filters to see all products."}
          </p>
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-8">You Might Like</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {suggestions.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}