// export default function AboutPage() {
//   return (
//     <div className="max-w-3xl mx-auto px-4 py-20">
//       <div className="text-center mb-12">
//         <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Who We Are</p>
//         <h1 className="text-4xl font-serif text-gray-900">Our Story</h1>
//       </div>
//       <div className="prose prose-gray mx-auto text-gray-600 leading-relaxed space-y-6">
//         <p>
//           BeJeweled was born out of a love for handcrafted silver jewellery and a desire to make timeless pieces accessible to everyone.
//         </p>
//         <p>
//           Every piece in our collection is thoughtfully designed and crafted in 925 sterling silver — built to last a lifetime and worn every day.
//         </p>
//         <p>
//           We are a small, passionate team and your support means the world to us. Thank you for being part of our journey.
//         </p>
//       </div>
//     </div>
//   )
// }

export default function AboutPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-20"
      style={{
        background: `
          linear-gradient(160deg, #0a1628 0%, #0d1f4a 30%, #091535 55%, #0e1e48 80%, #080f2a 100%)
        `,
      }}
    >
      {/* Satin sheen — diagonal light sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              120deg,
              transparent 0%,
              transparent 28%,
              rgba(255,255,255,0.04) 38%,
              rgba(255,255,255,0.09) 45%,
              rgba(255,255,255,0.04) 52%,
              transparent 62%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Satin fold lines — subtle depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              105deg,
              transparent 0px,
              transparent 60px,
              rgba(255,255,255,0.012) 60px,
              rgba(255,255,255,0.012) 61px
            )
          `,
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
          Who We Are
        </span>

        {/* Heading */}
        <h1
          className="text-4xl font-serif mb-6"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          Our Story
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

        {/* Body copy */}
        <div
          className="leading-relaxed space-y-5 text-[1.02rem]"
          style={{ color: "rgba(200,215,255,0.72)" }}
        >
          <p>
            BeJeweled was born out of a love for handcrafted silver jewellery
            and a desire to make timeless pieces accessible to everyone.
          </p>
          <p>
            Every piece in our collection is thoughtfully designed and crafted
            in 925 sterling silver — built to last a lifetime and worn every
            day.
          </p>
          <p>
            We are a small, passionate team and your support means the world
            to us. Thank you for being part of our journey.
          </p>
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
              Handcrafted with care
            </span>
            <span
              className="inline-block w-1.5 h-1.5 rotate-45"
              style={{ background: "rgba(180,200,255,0.4)" }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}