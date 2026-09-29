// Resend's test sender (onboarding@resend.dev) can only deliver to the Resend account owner.
// Once a domain is verified in Resend, set EMAIL_FROM (e.g. "BeJeweled <orders@yourdomain.in>")
// and customer emails go to customers automatically.
export const SHOP_EMAIL = process.env.SHOP_EMAIL || 'siddhidokania@gmail.com'
export const EMAIL_FROM = process.env.EMAIL_FROM || 'BeJeweled <onboarding@resend.dev>'
export const CAN_EMAIL_CUSTOMERS = Boolean(process.env.EMAIL_FROM)

// Where a customer-facing email should go right now
export function customerRecipient(customerEmail: string): string {
  return CAN_EMAIL_CUSTOMERS ? customerEmail : SHOP_EMAIL
}
