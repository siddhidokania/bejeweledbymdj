import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug.current}`} className="group">
      <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
        {product.images?.[0] ? (
          <Image
            src={urlFor(product.images[0]).width(400).height(400).url()}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500">₹{product.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}