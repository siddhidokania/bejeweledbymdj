import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// The dot in the ID makes this document private in Sanity (not readable without a token)
const COUNTER_ID = 'counters.orderNumber'
const FIRST_ORDER_NUMBER = 1001

async function ensureCounterExists() {
  const exists = await writeClient.fetch(`defined(*[_id == $id][0]._id)`, { id: COUNTER_ID })
  if (exists) return

  // First run: start after the highest existing order number so nothing is reused
  const numbers: string[] = await writeClient.fetch(`*[_type == "order" && defined(orderNumber)].orderNumber`)
  const highest = numbers.reduce((max, n) => {
    const value = parseInt(n.replace(/^BJ-/, ''), 10)
    return Number.isFinite(value) && value > max ? value : max
  }, FIRST_ORDER_NUMBER - 1)

  await writeClient.createIfNotExists({ _id: COUNTER_ID, _type: 'orderCounter', current: highest })
}

export async function generateOrderNumber(): Promise<string> {
  await ensureCounterExists()
  // Sanity applies patches to one document in sequence, so each order gets a unique number
  const counter = await writeClient.patch(COUNTER_ID).inc({ current: 1 }).commit<{ current: number }>()
  return `BJ-${counter.current}`
}
