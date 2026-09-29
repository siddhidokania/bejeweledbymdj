// Shown while a page's data loads from Sanity
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">Loading</p>
    </div>
  )
}
