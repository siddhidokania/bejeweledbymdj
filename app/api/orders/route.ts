import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.json([])

    const orders = await readClient.fetch(
      `*[_type == "order" && customer.email == $email] | order(createdAt desc)`,
      { email }
    )

    return NextResponse.json(orders ?? [])
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json([], { status: 500 })
  }
}