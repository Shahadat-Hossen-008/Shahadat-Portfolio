import { Condition } from 'payload'
import type { Link } from '@/payload-types'

export const showURLField: Condition<{ id: string }, Link> = (_, siblingData) => {
  if (siblingData?.type === 'external') {
    return true
  }
  return false
}

export const showRelationshipField: Condition<{ id: string }, Link> = (_, siblingData) => {
  if (siblingData?.type === 'internal') {
    return true
  }
  return false
}
