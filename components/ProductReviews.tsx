'use client'

import { useState } from 'react'
import { Review } from '@/types'

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-amber-400' : 'text-gray-200'}>
          ★
        </span>
      ))}
    </div>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`text-2xl transition ${
            star <= (hovered || value) ? 'text-amber-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ProductReviews({
  reviews,
  productId,
}: {
  reviews: Review[]
  productId: string
}) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleSubmit = async () => {
    if (!name || !rating) {
      setError('Please enter your name and select a rating.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, reviewerName: name, rating, comment }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="mt-20 border-t pt-12">
      <h2 className="text-2xl font-serif text-gray-900 mb-2">Customer Reviews</h2>

      {/* Average Rating */}
      {avgRating && (
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl font-serif text-gray-900">{avgRating}</span>
          <div>
            <StarDisplay rating={Math.round(Number(avgRating))} />
            <p className="text-sm text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm mb-10">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6 mb-12">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{review.reviewerName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              <StarDisplay rating={review.rating} />
              {review.comment && (
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      <div className="bg-[#faf9f7] p-6 rounded-lg">
        <h3 className="font-serif text-lg text-gray-900 mb-4">Write a Review</h3>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium">Thank you for your review! 🙏</p>
            {/* <p className="text-gray-500 text-sm mt-1">It will appear after approval.</p> */}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya S."
                className="w-full border border-gray-200 px-4 py-2 text-sm rounded focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Rating *</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Review (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love about this piece?"
                rows={3}
                className="w-full border border-gray-200 px-4 py-2 text-sm rounded focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-2 text-sm tracking-widest hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}