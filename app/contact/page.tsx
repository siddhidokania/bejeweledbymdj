export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Get In Touch</p>
        <h1 className="text-4xl font-serif text-gray-900">Contact Us</h1>
      </div>
      <div className="text-center space-y-4 text-gray-600">
        <p>Have a question or a custom order request? We'd love to hear from you.</p>
        <p>📧 <a href="mailto:hello@bejeweled.in" className="underline hover:text-gray-900">hello@bejeweled.in</a></p>
        <p>📸 <a href="https://instagram.com" className="underline hover:text-gray-900">@bejeweled</a></p>
      </div>
    </div>
  )
}
