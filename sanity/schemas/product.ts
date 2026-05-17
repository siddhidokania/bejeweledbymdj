import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price / MRP (₹)',
      type: 'number',
      description: 'Leave empty if no discount',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: "Women's", value: 'women' },
          { title: "Men's", value: 'men' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Rings', value: 'rings' },
          { title: 'Necklaces', value: 'necklaces' },
          { title: 'Earrings', value: 'earrings' },
          { title: 'Bracelets', value: 'bracelets' },
          { title: 'Pendants', value: 'pendants' },
          { title: 'Anklets', value: 'anklets' },
          { title: 'Bangles', value: 'bangles' },
          { title: 'Chains', value: 'chains' },
          { title: 'Cufflinks', value: 'cufflinks' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      description: 'Number of items available. Leave blank if unlimited.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badge',
      title: 'Product Badge',
      type: 'string',
      description: 'Optional badge shown on the product card',
      options: {
        list: [
          { title: 'New Arrival', value: 'new' },
          { title: 'Bestseller', value: 'bestseller' },
          { title: 'Limited Edition', value: 'limited' },
          { title: 'Staff Pick', value: 'staffpick' },
        ],
        layout: 'radio',
      },
    }),
  ],
})