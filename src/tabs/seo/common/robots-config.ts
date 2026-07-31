import { Field } from 'payload'

export function createRobotsConfigurationField(context: 'page' | 'global'): Field {
  return {
    name: 'robotsConfig',
    type: 'group',
    interfaceName: 'RobotsConfig',
    admin: {
      hideGutter: true,
      description:
        context == 'page'
          ? 'Configure how search engines interact with this page.'
          : 'Configure the default robots directives applied across your entire site.',
    },
    fields: [
      {
        name: 'disableIndex',
        type: 'checkbox',
        label: 'Disable Search Indexing',
        admin: {
          description:
            "Prevents search engines from showing this page in search results. Use for thank-you pages, duplicate content, or drafts you don't want people to find.",
        },
        required: true,
        defaultValue: false,
      },
      {
        name: 'disableFollow',
        type: 'checkbox',
        label: 'Disable Link Follow',
        admin: {
          description:
            'Prevents search engines from following links on this page. Rarely needed — use for pages that link to untrusted or sponsored content.',
        },
        required: true,
        defaultValue: false,
      },
      {
        name: 'disableImageIndex',
        type: 'checkbox',
        label: 'Disable Image Indexing',
        admin: {
          description:
            'Keeps images on this page out of Google Images and similar image search results.',
        },
        required: true,
        defaultValue: false,
      },
      {
        name: 'disableSnippet',
        type: 'checkbox',
        label: 'Disable Snippet',
        admin: {
          description:
            'Prevents search engines from displaying a text preview for this page in search results.',
        },
        required: true,
        defaultValue: false,
      },
    ],
  }
}
