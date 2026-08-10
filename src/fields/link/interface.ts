import { CollectionSlug, GroupField } from 'payload'

/**
 * Configuration options for `createLinkField`.
 *
 * Allows each usage (header, footer, blog CTA, project link, etc.) to
 * customize the field name, label, admin configuration, and which
 * collections an internal link may reference.
 *
 * `relationTo` is typed as `CollectionSlug[]`, even when only a single
 * collection is allowed. `CollectionSlug` represents the identifier of a
 * single Payload collection (for example `'pages'` or `'posts'`), while the
 * relationship field accepts an array so it can support one or many allowed
 * collections using the same API.
 *
 * Keeping `relationTo` consistently typed as an array also avoids
 * TypeScript narrowing issues that can occur when supporting both
 * `CollectionSlug` and `CollectionSlug[]`.
 *
 * Examples:
 *
 * relationTo: ['pages']
 *
 * relationTo: ['pages', 'posts']
 */
export interface LinkFieldConfig {
  name?: string
  label?: string
  admin?: GroupField['admin']
  relationTo?: CollectionSlug[]
}
