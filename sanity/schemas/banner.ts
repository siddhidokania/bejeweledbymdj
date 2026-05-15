import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Homepage Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'e.g. "New Collection Arrived" or "50% Off Sale"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. "Shop our latest silver pieces"',
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'e.g. "Shop Now" or "View Collection"',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'e.g. /shop or /shop?category=rings',
      initialValue: '/shop',
    }),
    defineField({
      name: 'active',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order (1 = first)',
      type: 'number',
      description: 'If multiple banners, which one shows first',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      media: 'image',
    },
    prepare({ title, active, media }) {
      return {
        title,
        subtitle: active ? '✅ Active' : '❌ Hidden',
        media,
      }
    },
  },
})