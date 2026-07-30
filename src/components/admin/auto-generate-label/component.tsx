'use client'
import { formatSlug } from '@/fields/slug/formatSlug'
import { FieldLabel, useField } from '@payloadcms/ui'
import { FieldLabelClientProps, TextFieldClient } from 'payload'
import { CSSProperties } from 'react'

interface AutoGenerateLabelProps {
  sourcePath?: string
  contentType?: 'text' | 'slug'
}

type props = AutoGenerateLabelProps & FieldLabelClientProps<TextFieldClient>

/**
 * Label component that adds an "Auto Generate" button next to a field's
 * label, copying (and optionally slug-formatting) a value from another
 * field (`sourcePath`) on the same form into this field, live and client-side.
 */
export function AutoGenerateLabel(props: props) {
  const { field, path, sourcePath = 'title', contentType = 'text' } = props
  const {
    setValue: setTargetValue,
    readOnly: isTargetReadOnly,
    formProcessing,
    formInitializing,
  } = useField<string>({ path })
  const { value: sourceValue } = useField<string>({ path: sourcePath })
  const handleClick = () => {
    if (!sourceValue) {
      return
    }

    const newValue = contentType === 'slug' ? formatSlug(sourceValue) : sourceValue

    setTargetValue(newValue)
  }
  const isDisabled = isTargetReadOnly || formProcessing || formInitializing

  const wrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
  }

  const buttonStyle: CSSProperties = {
    cursor: 'pointer',
    borderStyle: 'none',
    backgroundColor: 'transparent',
    padding: '0',
    color: '#007cba',
    textDecorationLine: 'underline',
    display: sourceValue ? 'inline' : 'none',
  }

  return (
    <div style={wrapperStyle}>
      <FieldLabel label={field?.label} path={path} />
      {!!sourceValue && (
        <button type="button" onClick={handleClick} disabled={isDisabled} style={buttonStyle}>
          Auto Generate
        </button>
      )}
    </div>
  )
}
