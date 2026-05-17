import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      description: 'e.g. Free shipping on orders above ₹999 🚚',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'e.g. Shop Now (leave blank for no link)',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      description: 'e.g. /shop',
    }),
    defineField({
      name: 'bgColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Black', value: 'bg-gray-900' },
          { title: 'Gold', value: 'bg-amber-600' },
          { title: 'Rose', value: 'bg-rose-500' },
          { title: 'Navy', value: 'bg-blue-900' },
          { title: 'Green', value: 'bg-emerald-700' },
        ],
        layout: 'radio',
      },
      initialValue: 'bg-gray-900',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide the announcement bar',
      initialValue: true,
    }),
  ],
})