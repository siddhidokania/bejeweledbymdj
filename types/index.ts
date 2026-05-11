export interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  weight: number
  gender: 'men' | 'women'
  subcategory: string
  images: any[]
  description: string
  inStock: boolean
  featured: boolean
}