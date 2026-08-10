import { Tab, TextField, ValidateOptions } from 'payload'
import { text } from 'payload/shared'
import { isValidUrl } from './validate'
import { createAfterReadHook } from './utils'
import { createRobotsConfigurationField } from '../common/robots-config'
import { createSchemaMarkupField } from '../common/schema-markup'

/**
 * Builds the "SEO" tab for a single document (page, project, blog, etc.).
 *
 * Includes: an SEO title/description (each with an optional "Auto Generate"
 * button that copies from another field), an Open Graph image, a canonical
 * URL, and a redirect URL (validated as an https:// link).
 *
 * The `title` and `description` fields also have an `afterRead` hook that
 * fills in a fallback value on public reads only — the admin panel always
 * shows the real (possibly empty) saved value, never a substituted one.
 *
 * @param descriptionSourcePath - Field to auto-generate the SEO description
 *   from (e.g. `'excerpt'`). Omit to disable the Auto Generate button on
 *   description entirely — do not pass `'description'` itself, or the
 *   button will read and write the same field (no-op).
 * @param titleSourcePathOverride - Field to auto-generate the SEO title
 *   from. Defaults to `'title'`, which is correct for most collections.
 */
export function createLocalSeoTab(
  descriptionSourcePath?: string,
  titleSourcePathOverride?: string,
): Tab {
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
          components: {
            Label: {
              path: '@/components/admin/auto-generate-label/component',
              exportName: 'AutoGenerateLabel',
              clientProps: {
                sourcePath: titleSourcePathOverride ?? 'title',
              },
            },
          },
        },
        hooks: { afterRead: [createAfterReadHook('title')] },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        admin: {
          description: 'SEO description for this page.',
          components: {
            Label: {
              path: '@/components/admin/auto-generate-label/component',
              exportName: 'AutoGenerateLabel',
              clientProps: {
                sourcePath: descriptionSourcePath,
              },
            },
          },
        },
        hooks: { afterRead: [createAfterReadHook('description')] },
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
      createRobotsConfigurationField('page'),
      createSchemaMarkupField('page'),
    ],
  }
}
