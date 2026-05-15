import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { productId, reviewerName, rating, comment } = await req.json()

    if (!productId || !reviewerName || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'review',
      product: { _type: 'reference', _ref: productId },
      reviewerName,
      rating: Number(rating),
      comment,
      approved: false, // always starts as pending
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}