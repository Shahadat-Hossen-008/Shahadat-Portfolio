import { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  admin: {
    useAsTitle: 'label',
    group: 'Content',
  },
  defaultPopulate: {
    label: true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
  ],
}
