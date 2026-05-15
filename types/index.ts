export interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  originalPrice?: number
  weight: number
  gender: 'men' | 'women'
  subcategory: string
  images: any[]
  description: string
  inStock: boolean
  stock?: number
  featured: boolean
}

export interface Banner {
  _id: string
  title: string
  subtitle?: string
  image: any
  buttonText?: string
  buttonLink?: string
  active: boolean
  order: number
}

export interface Review {
  _id: string
  reviewerName: string
  rating: number
  comment?: string
  approved: boolean
  createdAt: string
}

export interface OrderItem {
  product: { _ref: string }
  productName: string
  quantity: number
  priceAtOrder: number
}

export interface Order {
  _id: string
  orderNumber: string
  createdAt: string
  customer: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  items: OrderItem[]
  subtotal: number
  discount: number
  couponCode?: string
  totalAmount: number
  paymentMethod: 'razorpay' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  orderStatus: 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  courierName?: string
  trackingUrl?: string
  deliveryNotes?: string
  internalNotes?: string
}