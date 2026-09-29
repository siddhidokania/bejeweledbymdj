import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { urlFor } from '@/lib/sanity'

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-emerald-500 text-white',
  bestseller: 'bg-amber-500 text-white',
  limited: 'bg-purple-600 text-white',
  staffpick: 'bg-blue-600 text-white',
}

const BADGE_LABELS: Record<string, string> = {
  new: 'New Arrival',
  bestseller: 'Bestseller',
  limited: 'Limited Edition',
  staffpick: 'Staff Pick',
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const isOutOfStock = product.inStock === false || product.stock === 0

  return (
    <Link href={`/product/${product.slug.current}`} className="group">
      <div className="aspect-square bg-gray-100 overflow-hidden mb-3 relative">
        {product.images?.[0] ? (
          <Image
            src={urlFor(product.images[0]).width(400).height(400).url()}
            alt={product.name}
            width={400}
            height={400}
            className={`w-full h-full object-cover transition duration-500 ${
              isOutOfStock ? 'grayscale opacity-60' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-semibold tracking-widest px-4 py-2 uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Top left — discount OR product badge (not both) */}
        {!isOutOfStock && (
          <>
            {discount ? (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-medium">
                {discount}% OFF
              </div>
            ) : product.badge ? (
              <div className={`absolute top-2 left-2 text-xs px-2 py-1 font-medium ${BADGE_STYLES[product.badge]}`}>
                {BADGE_LABELS[product.badge]}
              </div>
            ) : null}
          </>
        )}

        {/* Top right — product badge when discount is also showing */}
        {!isOutOfStock && discount && product.badge && (
          <div className={`absolute top-2 right-2 text-xs px-2 py-1 font-medium ${BADGE_STYLES[product.badge]}`}>
            {BADGE_LABELS[product.badge]}
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
      <div className="flex items-center gap-2">
        <p className={`text-sm font-medium ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        {!isOutOfStock && product.stock !== undefined && product.stock !== null && product.stock <= 5 && product.stock > 0 && (
          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            Only {product.stock} left!
          </span>
        )}
        {product.originalPrice && !isOutOfStock && (
          <>
            <p className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
            <p className="text-xs text-red-500 font-medium">{discount}% off</p>
          </>
        )}
      </div>
    </Link>
  )
}