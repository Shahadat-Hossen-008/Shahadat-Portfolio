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
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image/' } },
              admin: {
                description: 'If set, displayed instead of the site title text in the header.',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Site Title',
              admin: {
                description: 'Used as a text fallback when no logo is uploaded.',
              },
            },
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
