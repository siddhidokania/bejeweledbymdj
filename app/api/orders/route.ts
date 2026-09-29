import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function GET() {
  try {
    // Only ever return the signed-in user's own orders — never trust an email from the URL
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    if (!user || !email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const orders = await readClient.fetch(
      `*[_type == "order" && lower(customer.email) == lower($email)] | order(createdAt desc){
        _id, orderNumber, createdAt, totalAmount, orderStatus, paymentStatus,
        items[]{ productName, quantity, priceAtOrder }
      }`,
      { email }
    )

    return NextResponse.json(orders ?? [])
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
