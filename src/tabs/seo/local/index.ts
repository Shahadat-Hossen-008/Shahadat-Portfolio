import { Tab, TextField, ValidateOptions } from 'payload'
import { text } from 'payload/shared'
import { isValidUrl } from './validate'
import { createAfterReadHook } from './utils'

export function createLocalSeoTab(): Tab {
  return {
    name: 'localSeoTab',
    label: 'SEO',
    interfaceName: 'LocalSeoTab',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        admin: {
          description:
            'SEO title for this page. If not provided, it will fall back to a suitable document property (e.g., the page title)',
        },
        hooks: { afterRead: [createAfterReadHook('title')] },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        admin: {
          description: 'SEO description for this page.',
        },
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
        filterOptions: { mimeType: { contains: 'image/' } },
        admin: {
          description: "Open Graph image for this page's URL.",
        },
        hooks: { afterRead: [createAfterReadHook('description')] },
      },
      {
        name: 'canonicalUrl',
        label: 'Canonical URL',
        type: 'text',
        admin: {
          description: 'If not provided it will be a self-referencing URL.',
        },
      },
      {
        name: 'redirect',
        type: 'text',
        label: 'Redirect',
        admin: {
          description: 'Redirect URL for this page. Please start with https://',
        },
        validate: (
          value: string | undefined | null,
          ctx: ValidateOptions<unknown, unknown, TextField, string>,
        ) => {
          if (value) {
            if (!isValidUrl(value, ['https'])) {
              return 'Invalid URL'
            } else {
              return text(value, ctx)
            }
          } else {
            return text(value, ctx)
          }
        },
      },
    ],
  }
}
