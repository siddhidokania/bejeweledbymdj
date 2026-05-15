import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export async function generateOrderNumber(): Promise<string> {
  // Count existing orders and increment
  const count = await writeClient.fetch(`count(*[_type == "order"])`)
  const next = (count || 0) + 1001
  return `BJ-${next}`
}