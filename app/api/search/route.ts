import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get('q') ?? '') as string

  if (query.length < 2) return NextResponse.json([])

  // Split into individual words for better matching
  const words = query.trim().split(/\s+/)
  
  // Build a filter that matches any word
  const filters = words.map((_, i) => `
    name match $word${i} ||
    subcategory match $word${i} ||
    description match $word${i} ||
    gender match $word${i}
  `).join(' || ')

  const params: Record<string, string> = {}
  words.forEach((word, i) => {
    params[`word${i}`] = `${word}*`
  })

  const products = await client.fetch(
    `*[_type == "product" && (${filters})][0...8]`,
    params
  )

  return NextResponse.json(products)
}