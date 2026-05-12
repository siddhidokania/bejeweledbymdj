// export default function ContactPage() {
//   return (
//     <div className="max-w-xl mx-auto px-4 py-20">
//       <div className="text-center mb-12">
//         <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Get In Touch</p>
//         <h1 className="text-4xl font-serif text-gray-900">Contact Us</h1>
//       </div>
//       <div className="text-center space-y-4 text-gray-600">
//         <p>Have a question or a custom order request? We'd love to hear from you.</p>
//         <p>📧 <a href="mailto:hello@bejeweled.in" className="underline hover:text-gray-900">hello@bejeweled.in</a></p>
//         <p>📸 <a href="https://instagram.com" className="underline hover:text-gray-900">@bejeweled</a></p>
//       </div>
//     </div>
//   )
// }

export default function ContactPage() {
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
      `}</style>

      <div
        className="relative min-h-screen w-full flex items-center justify-center px-4 py-20"
        style={{
          background:
            "linear-gradient(160deg, #0a1628 0%, #0d1f4a 30%, #091535 55%, #0e1e48 80%, #080f2a 100%)",
        }}
      >
        {/* Satin sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, transparent 28%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0.04) 52%, transparent 62%, transparent 100%)",
          }}
        />

        {/* Satin fold lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(105deg, transparent 0px, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)",
          }}
        />

        {/* Edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(4,8,20,0.55) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-xl w-full text-center px-6 py-14">

          {/* Badge */}
          <span
            className="inline-block rounded-full px-4 py-1 text-[11px] tracking-[0.25em] uppercase mb-5"
            style={{
              border: "1px solid rgba(180,200,255,0.25)",
              color: "rgba(180,200,255,0.6)",
            }}
          >
            Get In Touch
          </span>

          {/* Heading */}
          <h1
            className="text-4xl font-serif mb-6"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Contact Us
          </h1>

          {/* Top divider */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)",
              }}
            />
            <span
              className="inline-block w-1.5 h-1.5 rotate-45"
              style={{ background: "rgba(180,200,255,0.55)" }}
            />
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)",
              }}
            />
          </div>

          {/* Intro */}
          <p
            className="mb-10 text-[1.02rem] leading-relaxed"
            style={{ color: "rgba(200,215,255,0.72)" }}
          >
            Have a question or a custom order request? We&apos;d love to hear from you.
          </p>

          {/* Contact cards */}
          <div className="space-y-4 mb-10">

            {/* Email */}
            <a
              href="mailto:bejeweledbymdj@gmail.com"
              className="contact-card flex items-center justify-center gap-4 w-full rounded-xl px-6 py-4"
            >
              <span style={{ color: "rgba(180,200,255,0.55)", fontSize: "1.1rem" }}>
                ✉
              </span>
              <div className="text-left">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-0.5"
                  style={{ color: "rgba(180,200,255,0.45)" }}
                >
                  Email Us
                </p>
                <p
                  className="text-sm font-serif"
                  style={{ color: "rgba(220,230,255,0.85)" }}
                >
                  bejeweledbymdj@gmail.com
                </p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/bejeweledbymdj/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card flex items-center justify-center gap-4 w-full rounded-xl px-6 py-4"
            >
              <span style={{ color: "rgba(180,200,255,0.55)", fontSize: "1.1rem" }}>
                ◈
              </span>
              <div className="text-left">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-0.5"
                  style={{ color: "rgba(180,200,255,0.45)" }}
                >
                  Instagram
                </p>
                <p
                  className="text-sm font-serif"
                  style={{ color: "rgba(220,230,255,0.85)" }}
                >
                  @bejeweled
                </p>
              </div>
            </a>

          </div>

          {/* Bottom divider */}
          <div className="flex items-center justify-center gap-3 my-7">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)",
              }}
            />
            <span
              className="inline-block w-1.5 h-1.5 rotate-45"
              style={{ background: "rgba(180,200,255,0.55)" }}
            />
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(180,200,255,0.3), transparent)",
              }}
            />
          </div>

          {/* Bottom stamp */}
          <div className="flex justify-center">
            <div
              className="flex items-center gap-2.5 rounded-full px-5 py-2"
              style={{ border: "1px solid rgba(180,200,255,0.18)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rotate-45"
                style={{ background: "rgba(180,200,255,0.4)" }}
              />
              <span
                className="text-[11px] tracking-[0.25em] uppercase"
                style={{ color: "rgba(180,200,255,0.45)" }}
              >
                We&apos;d love to hear from you
              </span>
              <span
                className="inline-block w-1.5 h-1.5 rotate-45"
                style={{ background: "rgba(180,200,255,0.4)" }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}