// Shared by the checkout page (display) and /api/order (the amount actually charged)
export const FREE_SHIPPING_THRESHOLD = 999
export const SHIPPING_FEE = 99
export const MAX_QUANTITY_PER_ITEM = 10

export function getShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}
