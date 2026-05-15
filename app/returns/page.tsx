import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Exchange Policy | BeJeweled',
  description: 'Easy 15-day returns and exchanges on all BeJeweled handcrafted silver jewellery. No questions asked.',
}

export default function ReturnsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-3">Returns & Exchange</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Our Promise to You</p>
      </div>

      {/* Promise Banner */}
      <div className="bg-[#faf9f7] border border-gray-100 rounded-lg p-6 mb-12 text-center">
        <p className="text-2xl font-serif text-gray-900 mb-2">15-Day No Questions Asked Policy</p>
        <p className="text-gray-500 text-sm leading-relaxed">
          Not happy with your purchase? We'll make it right — hassle free.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

        {/* Eligibility */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">What Can Be Returned or Exchanged</h2>
          <ul className="space-y-2 list-none">
            {[
              'Item must be unused and unworn',
              'Must be in original condition with no scratches, damage, or signs of use',
              'Original packaging, box, and invoice must be included',
              'Request must be raised within 15 days of delivery',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Not Eligible */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">What Cannot Be Returned</h2>
          <ul className="space-y-2 list-none">
            {[
              'Customised or personalised jewellery (engraved, made-to-order)',
              'Items that have been worn, resized, or altered',
              'Products without original packaging or invoice',
              'Items purchased on sale or with a discount code (exchange only, no refund)',
              'Earrings for hygiene reasons, unless defective',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How to Initiate */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">How to Initiate a Return or Exchange</h2>
          <ol className="space-y-3 list-none">
            {[
              { step: '01', text: 'WhatsApp us at +91 80023 61934 or email bejeweledbymdj@gmail.com within 15 days of delivery.' },
              { step: '02', text: 'Share your order number, reason for return, and clear photos of the item.' },
              { step: '03', text: 'Our team will review and confirm eligibility within 1–2 business days.' },
              { step: '04', text: 'Pack the item securely in its original packaging and ship it to our address.' },
              { step: '05', text: 'Once received and quality-checked, your refund or exchange will be processed.' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-4">
                <span className="text-xs font-medium text-gray-400 mt-0.5 min-w-[24px]">{step}</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Refunds */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">Refunds</h2>
          <ul className="space-y-2 list-none">
            {[
              'Refunds are processed within 7–10 business days after the returned item passes quality check.',
              'Refund is credited to your original payment method (UPI, card, net banking).',
              'Original shipping charges are non-refundable.',
              'If your pincode is not reverse-serviceable, you may need to ship via India Post — we will reimburse up to ₹70 in shipping costs.',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Exchange */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">Exchanges</h2>
          <ul className="space-y-2 list-none">
            {[
              'You can exchange for any other product of equal or higher value (pay the difference).',
              'Sale items are eligible for exchange only — no cash refund.',
              'Exchanged items follow the same eligibility conditions above.',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Damaged / Defective */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">Damaged or Defective Items</h2>
          <p>
            If you receive a damaged, defective, or incorrect item, please contact us within{' '}
            <strong className="text-gray-900 font-medium">48 hours of delivery</strong> with photos.
            We will arrange a free replacement or full refund with no questions asked — including return shipping costs.
          </p>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-lg font-serif text-gray-900 mb-3">Shipping Policy</h2>
          <ul className="space-y-2 list-none">
            {[
              'All orders are dispatched within 2–4 business days.',
              'Standard delivery takes 5–7 business days across India.',
              'Free shipping on all orders pan India.',
              'A tracking number will be shared via WhatsApp once your order is shipped.',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-[#faf9f7] border border-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-serif text-gray-900 mb-3">Still Have Questions?</h2>
          <p className="mb-4">Our team is happy to help. Reach out via:</p>
          <div className="space-y-2">
            <p>
              <span className="text-gray-400">WhatsApp —</span>{' '}
              <a href="https://wa.me/918002361934" className="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition">
                +91 80023 61934
              </a>
            </p>
            <p>
              <span className="text-gray-400">Email —</span>{' '}
              <a href="mailto:bejeweledbymdj@gmail.com" className="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition">
                bejeweledbymdj@gmail.com
              </a>
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}