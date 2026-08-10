import { GroupField } from 'payload'
import { LinkFieldConfig } from './interface'
import {
  sanitizeLinkField,
  showRelationshipField,
  showURLField,
  validateReferenceField,
  validateURLField,
} from './utils'

/**
 * Creates a reusable link field supporting both internal relationships and
 * external URLs.
 *
 * The `type` field acts as a discriminator:
 *
 * - `'external'` requires `url`
 * - `'internal'` requires `reference`
 *
 * The inactive field is hidden in the admin UI, validated on the server, and
 * automatically cleared before saving so obsolete values are never persisted.
 *
 * Using a field factory keeps link behavior consistent across headers,
 * footers, CTAs, navigation items, and any future components without
 * duplicating configuration.
 */
export const createLinkField = (config: LinkFieldConfig = {}): GroupField => {
  return {
    name: config.name ?? 'link',
    ...(config.label ? { label: config.label } : {}), //spread only adds `label` if provided, avoiding an explicit `undefined` keyobject
    type: 'group',
    interfaceName: 'Link',
    admin: {
      hideGutter: true,
      ...config.admin,
    },
    hooks: {
      beforeChange: [sanitizeLinkField],
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
                validate: validateURLField,
                admin: { condition: showURLField },
              },
              {
                name: 'reference',
                type: 'relationship',
                relationTo: config.relationTo ?? ['pages'],
                validate: validateReferenceField,
                admin: { condition: showRelationshipField },
              },
            ],
          },
        ],
      },
    ],
  }
}
