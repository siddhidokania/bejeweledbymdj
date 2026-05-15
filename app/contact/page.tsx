'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        .contact-card {
          border: 1px solid rgba(180,200,255,0.15);
          background: rgba(255,255,255,0.04);
          transition: border 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .contact-card:hover {
          border: 1px solid rgba(180,200,255,0.45);
          background: rgba(180,200,255,0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(100,140,255,0.12);
        }
        .form-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(180,200,255,0.2);
          color: rgba(220,230,255,0.9);
          transition: border 0.2s;
          width: 100%;
          padding: 12px 16px;
          font-size: 0.875rem;
          outline: none;
          border-radius: 8px;
        }
        .form-input::placeholder {
          color: rgba(180,200,255,0.3);
        }
        .form-input:focus {
          border: 1px solid rgba(180,200,255,0.6);
        }
      `}</style>

      <div
        className="relative min-h-screen w-full flex items-center justify-center px-4 py-20"
        style={{
          background: "linear-gradient(160deg, #0a1628 0%, #0d1f4a 30%, #091535 55%, #0e1e48 80%, #080f2a 100%)",
        }}
      >
        {/* Satin sheen */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(120deg, transparent 0%, transparent 28%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0.04) 52%, transparent 62%, transparent 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(105deg, transparent 0px, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(4,8,20,0.55) 100%)" }} />

        <div className="relative z-10 max-w-xl w-full text-center px-6 py-14">

          {/* Badge */}
          <span className="inline-block rounded-full px-4 py-1 text-[11px] tracking-[0.25em] uppercase mb-5" style={{ border: "1px solid rgba(180,200,255,0.25)", color: "rgba(180,200,255,0.6)" }}>
            Get In Touch
          </span>

          {/* Heading */}
          <h1 className="text-4xl font-serif mb-6" style={{ color: "rgba(255,255,255,0.95)" }}>
            Contact Us
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)" }} />
            <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: "rgba(180,200,255,0.55)" }} />
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)" }} />
          </div>

          <p className="mb-10 text-[1.02rem] leading-relaxed" style={{ color: "rgba(200,215,255,0.72)" }}>
            Have a question or a custom order request? We&apos;d love to hear from you.
          </p>

          {/* Contact Cards */}
          <div className="space-y-4 mb-10">
            <a href="mailto:bejeweledbymdj@gmail.com" className="contact-card flex items-center justify-center gap-4 w-full rounded-xl px-6 py-4">
              <span style={{ color: "rgba(180,200,255,0.55)", fontSize: "1.1rem" }}>✉</span>
              <div className="text-left">
                <p className="text-[10px] tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(180,200,255,0.45)" }}>Email Us</p>
                <p className="text-sm font-serif" style={{ color: "rgba(220,230,255,0.85)" }}>bejeweledbymdj@gmail.com</p>
              </div>
            </a>
            <a href="https://www.instagram.com/bejeweledbymdj/" target="_blank" rel="noopener noreferrer" className="contact-card flex items-center justify-center gap-4 w-full rounded-xl px-6 py-4">
              <span style={{ color: "rgba(180,200,255,0.55)", fontSize: "1.1rem" }}>◈</span>
              <div className="text-left">
                <p className="text-[10px] tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(180,200,255,0.45)" }}>Instagram</p>
                <p className="text-sm font-serif" style={{ color: "rgba(220,230,255,0.85)" }}>@bejeweled</p>
              </div>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)" }} />
            <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: "rgba(180,200,255,0.55)" }} />
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)" }} />
          </div>

          {/* Contact Form */}
          {status === 'success' ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-4">💌</p>
              <h2 className="text-2xl font-serif mb-2" style={{ color: "rgba(255,255,255,0.95)" }}>Message Sent!</h2>
              <p className="mb-6" style={{ color: "rgba(200,215,255,0.72)" }}>Thank you! We'll get back to you soon.</p>
              <button
                onClick={() => setStatus('idle')}
                className="rounded-full px-6 py-2 text-sm tracking-widest uppercase"
                style={{ border: "1px solid rgba(180,200,255,0.4)", color: "rgba(180,200,255,0.8)" }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase block mb-2" style={{ color: "rgba(180,200,255,0.45)" }}>Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase block mb-2" style={{ color: "rgba(180,200,255,0.45)" }}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase block mb-2" style={{ color: "rgba(180,200,255,0.45)" }}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="form-input resize-none"
                  placeholder="Tell us about your query or custom order..."
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 text-sm tracking-widest uppercase rounded-lg mt-2 transition"
                style={{
                  background: status === 'loading' ? 'rgba(180,200,255,0.1)' : 'rgba(180,200,255,0.15)',
                  border: '1px solid rgba(180,200,255,0.35)',
                  color: 'rgba(220,230,255,0.9)',
                }}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}

          {/* Bottom stamp */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2.5 rounded-full px-5 py-2" style={{ border: "1px solid rgba(180,200,255,0.18)" }}>
              <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: "rgba(180,200,255,0.4)" }} />
              <span className="text-[11px] tracking-[0.25em] uppercase" style={{ color: "rgba(180,200,255,0.45)" }}>We&apos;d love to hear from you</span>
              <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: "rgba(180,200,255,0.4)" }} />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}