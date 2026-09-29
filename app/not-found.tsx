import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-4">404</p>
      <h1 className="text-4xl font-serif text-gray-900 mb-4">This piece has wandered off</h1>
      <p className="text-gray-500 mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved or been removed. Take a look at what&apos;s in the collection now.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/shop" className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-700 transition">
          SHOP THE COLLECTION
        </Link>
        <Link href="/" className="border border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-widest hover:bg-gray-100 transition">
          GO HOME
        </Link>
      </div>
    </div>
  )
}
