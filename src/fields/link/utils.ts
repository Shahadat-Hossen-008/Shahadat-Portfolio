import {
  Condition,
  FieldHook,
  RelationshipField,
  RelationshipValue,
  TextField,
  Validate,
} from 'payload'
import type { Link } from '@/payload-types'

/**
 * Removes stale data before saving so only the field relevant to the current
 * link `type` is persisted (e.g. clears `reference` for external links and
 * `url` for internal links).
 *
 * The value type includes `undefined` because a brand-new document may not
 * contain this group yet. Handling that case explicitly prevents runtime
 * errors such as reading `.type` from `undefined`.
 *
 * The parent document is typed as `{ id: string }` because this field is
 * designed to be reusable across multiple collections and globals. `id` is
 * the only property guaranteed to exist on every Payload document, and this
 * hook doesn't require any additional document fields.
 */
export const sanitizeLinkField: FieldHook<{ id: string }, Link | undefined, unknown> = ({
  value,
}) => {
  if (!value) {
    return value
  }

  if (value.type === 'external') {
    return { ...value, reference: null }
  }

  if (value.type === 'internal') {
    return { ...value, url: null }
  }

  return value
}

/**
 * Controls admin UI visibility by showing the `url` field only when
 * `type` is `'external'`.
 *
 * This affects the editor interface only. Hidden fields can still be sent to
 * the server, which is why `validateURLField` and `sanitizeLinkField` are
 * still required.
 */

export const showURLField: Condition<{ id: string }, Link> = (_data, siblingData) => {
  if (siblingData?.type === 'external') {
    return true
  }
  return false
}

/**
 * Validates external URLs on the server.
 *
 * Validation is skipped unless `type` is `'external'`. When required, the
 * value must be a valid HTTP(S), `mailto:`, or `tel:` URL.
 *
 * This runs on every save, ensuring the data remains valid regardless of
 * whether it comes from the admin UI or another server entry point.
 */
export const validateURLField: Validate<string, unknown, Link, TextField> = (
  value,
  { siblingData },
) => {
  const { type } = siblingData

  if (type !== 'external') {
    return true
  }

  if (!value) {
    return 'Required'
  }
  if (/^mailto:.+@.+\..+/i.test(value)) {
    return true
  }
  if (/^tel:[+\d][\d\s().-]*$/i.test(value)) {
    return true
  }

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
  return urlPattern.test(value) ? true : 'Please enter a valid URL'
}

/**
 * Controls admin UI visibility by showing the `reference` field only when
 * `type` is `'internal'`.
 *
 * Like `showURLField`, this only affects the editor interface. Server-side
 * validation and cleanup are still responsible for protecting persisted data.
 */

export const showRelationshipField: Condition<{ id: string }, Link> = (_data, siblingData) => {
  if (siblingData?.type === 'internal') {
    return true
  }
  return false
}

/**
 * Validates internal references on the server.
 *
 * Validation is skipped unless `type` is `'internal'`. When required, a
 * relationship must be selected.
 *
 * Only presence is validated here. The relationship field itself already
 * guarantees that the stored value references one of the allowed collections,
 * so repeating that validation would be redundant.
 */
export const validateReferenceField: Validate<
  RelationshipValue,
  unknown,
  Link,
  RelationshipField
> = (val, { siblingData }) => {
  const { type } = siblingData

  if (type !== 'internal') {
    return true
  }

  return val ? true : 'Required'
}
