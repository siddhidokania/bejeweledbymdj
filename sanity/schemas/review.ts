import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Product Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewerName',
      title: 'Reviewer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'comment',
      title: 'Review Comment',
      type: 'text',
    }),
    defineField({
      name: 'approved',
      title: 'Approved (show on website)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      name: 'reviewerName',
      rating: 'rating',
      product: 'product.name',
      approved: 'approved',
    },
    prepare({ name, rating, product, approved }) {
      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
      return {
        title: `${name} — ${stars}`,
        subtitle: `${product} ${approved ? '✅ Approved' : '⏳ Pending'}`,
      }
    },
  },
})