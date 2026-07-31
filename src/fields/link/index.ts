import { GroupField } from 'payload'
import { LinkFieldConfig } from './interface'
import { showRelationshipField, showURLField } from './utils'

export const createLinkField = (config: LinkFieldConfig = {}): GroupField => {
  return {
    name: config.name ?? 'link',
    ...(config.label ? { label: config.label } : {}), //We use spread for merge the object
    type: 'group',
    interfaceName: 'Link',
    admin: {
      hideGutter: true,
      ...config.admin,
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          //Content
          {
            label: 'Content',
            fields: [
              {
                name: 'label',
                type: 'text',
              },
              {
                name: 'type',
                type: 'radio',
                options: [
                  { label: 'External', value: 'external' },
                  { label: 'Internal', value: 'internal' },
                ],
                defaultValue: 'external',
                required: true,
              },
              {
                name: 'url',
                type: 'text',
                admin: { condition: showURLField },
              },
              {
                name: 'reference',
                type: 'relationship',
                relationTo: ['pages'],
                admin: { condition: showRelationshipField },
              },
            ],
          },
        ],
      },
    ],
  }
}
