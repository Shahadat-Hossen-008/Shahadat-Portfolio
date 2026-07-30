import type { Field, TextFieldSingleValidation } from 'payload'
import { validateSlug } from './validateSlug'
import { formatSlug } from './formatSlug'

type SlugFieldOverrides = {
  fieldToUse?: string
  overrides?: {
    label?: string
    required?: boolean
    unique?: boolean
    index?: boolean
    defaultValue?: string
    validate?: TextFieldSingleValidation
    admin?: {
      description?: string
      readOnly?: boolean
    }
  }
}

/**
 * @fileoverview Slug field for Payload collections. Drop this into any
 * collection that needs a `/url-slug` — handles cleanup, auto-gen, and
 * locking so you don't have to think about it every time.
 *
 * How it works:
 * - Adds two fields: `slug` (the actual text field) and `slugLock` (checkbox).
 * - While locked (default), slug auto-fills from `title` as you type.
 * - Uncheck the lock to type your own custom slug instead.
 * - Once the doc is saved, the slug freezes on future edits (as long as
 *   still locked) — so changing the title later won't silently break
 *   published links. If you want to change the slug, you have to unlock it
 *
 * Why `overrides` isn't just `Partial<Field>` or `Partial<TextField>`:
 * Payload's `Field`/`TextField` types are
 * unions under the hood (text/upload/relationship/hasMany variants etc.),
 * and slicing a union with Omit/Partial/indexing loses the specific literal
 * types (e.g. `position: 'sidebar'` turns into plain `string`). TS then
 * compares your object against the wrong variant in the union and throws
 * confusing errors that have nothing to do with your actual bug. Easiest
 * fix: just write your own small `overrides` shape by hand instead of
 * trying to reuse Payload's. A few more lines, but no more weird errors,
 * and it also stops anyone from overriding stuff that'd break this field
 * (like `name` or `type`).
 *
 * Why `satisfies Field` and not `: Field` or `as Field`:
 * - `: Field` → widens your object to the whole union too early, same
 *   false-error problem as above.
 * - `as Field` → basically turns off type checking. Compiles even if you
 *   typo a property. Don't use this as a "fix," it's just hiding the error.
 * - `satisfies Field` → TS figures out your object is a TextField first,
 *   THEN checks it against Field. Real errors still get caught, no fake ones.
 *
 * @see https://payloadcms.com/docs/fields/overview
 */
export const createSlugField = ({
  fieldToUse = 'title',
  overrides = {},
}: SlugFieldOverrides = {}): Field[] => {
  const { admin: adminOverrides, ...restOverrides } = overrides

  const slugField = {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    label: 'Slug',
    admin: {
      position: 'sidebar',
      description:
        "The slug is used in the URL for this page. It's recommended to keep it short and descriptive.",
      condition: (_, siblingData) => !siblingData?.slugLock,
      ...adminOverrides,
      components: {
        Label: {
          path: '@/components/admin/auto-generate-label/component',
          exportName: 'AutoGenerateLabel',
          clientProps: {
            sourcePath: fieldToUse,
            contentType: 'slug',
          },
        },
      },
    },
    hooks: {
      beforeValidate: [
        ({ value, siblingData, originalDoc, operation }) => {
          const isLocked = siblingData?.slugLock ?? true

          if (operation === 'update' && originalDoc?.slug && isLocked) {
            if (!value || value === originalDoc.slug) {
              return originalDoc.slug
            }
            return value
          }

          let source: string

          if (isLocked || !value) {
            source = siblingData?.[fieldToUse] || originalDoc?.[fieldToUse]
          } else {
            source = value
          }

          return formatSlug(source)
        },
      ],
    },
    validate: validateSlug,
    ...restOverrides,
  } satisfies Field

  const slugLockField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      position: 'sidebar',
      description: 'Auto-generate slug from title. Uncheck to edit manually.',
    },
  } satisfies Field

  return [slugField, slugLockField]
}
