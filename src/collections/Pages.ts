import { createSlugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    plural: 'Pages',
    singular: 'Page',
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The name of the page',
        position: 'sidebar',
      },
    },
    ...createSlugField({ fieldToUse: 'title' }),
  ],
}
