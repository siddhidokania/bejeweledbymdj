import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#faf9f7] border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-gray-900 mb-4">BeJeweled</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Handcrafted silver jewellery for every occasion. Made with love, worn with pride.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-900 transition">Shop</Link>
              <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition">About</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition">Contact</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">Follow Us</h4>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/bejeweledbymdj/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition">
                Facebook
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} BeJeweled. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}