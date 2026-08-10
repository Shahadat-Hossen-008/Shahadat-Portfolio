import { Field } from 'payload'

export function createSchemaMarkupField(context: 'page' | 'global'): Field {
  return {
    name: 'schemaMarkup',
    type: 'array',
    interfaceName: 'SchemaMarkup',
    admin: {
      description:
        context === 'page'
          ? 'Add a JSON-LD object (e.g. {"@context": "https://schema.org", "@type": "Article", ...}) describing this page to help search engines understand its content.'
          : 'Add JSON-LD that applies site-wide — e.g. Organization or WebSite schema — to help search engines understand your site as a whole.',
    },
    fields: [
      {
        type: 'json',
        name: 'jsonLD',
        label: 'JSON-LD',
        required: true,
        validate: (value: unknown) => {
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return 'Enter a valid JSON-LD object, e.g. {"@context": "https://schema.org", "@type": "Article"}.'
          }
          if (!('@context' in value) && !('@graph' in value)) {
            return 'Missing "@context" — this doesn\'t look like valid JSON-LD.'
          }
          return true
        },
      },
    ],
  }
}
