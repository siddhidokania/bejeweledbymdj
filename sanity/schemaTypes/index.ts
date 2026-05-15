import { type SchemaTypeDefinition } from 'sanity'
import product from '../schemas/product'
import banner from '../schemas/banner'
import review from '../schemas/review'
import order from '../schemas/order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, banner, review, order],
}