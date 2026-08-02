import { createLinkField } from '@/fields/link'
import { GlobalConfig } from 'payload'

export const Layout: GlobalConfig = {
  slug: 'layout',
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'header',
          label: 'Header',
          interfaceName: 'IPayloadHeader',
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'links',
              type: 'array',
              label: { singular: 'Nav Link', plural: 'Nav Links' },
              fields: [createLinkField()],
            },
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          interfaceName: 'IPayloadFooter',
          fields: [
            { name: 'copyright', type: 'text' },
            {
              name: 'links',
              type: 'array',
              label: { singular: 'Link', plural: 'Links' },
              fields: [createLinkField()],
            },
          ],
        },
      ],
    },
  ],
}
