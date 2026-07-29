import { CollectionSlug, FieldHook } from 'payload'

/** Returns the SEO fallback string for a collection/field pair, or '' if none is defined. */
function getSeoFallback(slug: CollectionSlug, data: any, field: 'title' | 'description') {
  switch (slug) {
    case 'pages':
      return field === 'title' ? (data.title ?? '') : ''

    // case 'projects':
    //   return field === 'title' ? (data.title ?? '') : ''

    // case 'blogs':
    //   return field === 'title' ? (data.title ?? '') : ''

    case 'tags':
      return field === 'title' ? (data.label ?? '') : ''

    default:
      return ''
  }
}

/** afterRead hook: returns the real value if saved or user is authenticated, otherwise a computed SEO fallback. Never writes to the database. */
export function createAfterReadHook(field: 'title' | 'description'): FieldHook {
  return ({ value, data, collection, req: { user } }) => {
    if (user || value) {
      return value ?? ''
    }

    if (!data) {
      return ''
    }

    const slug = collection?.slug
    if (slug === 'pages') {
      return getSeoFallback(slug, data, field)
    }

    return value ?? ''
  }
}
