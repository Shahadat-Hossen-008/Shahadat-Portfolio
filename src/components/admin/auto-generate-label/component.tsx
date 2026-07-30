'use client'
import { FieldLabel, useField } from '@payloadcms/ui'
import { FieldLabelClientProps, TextFieldClient } from 'payload'
import { CSSProperties } from 'react'

interface AutoGenerateLabelProps {
  sourcePath?: string
}

type props = AutoGenerateLabelProps & FieldLabelClientProps<TextFieldClient>

export function AutoGenerateLabel(props: props) {
  const { field, path, sourcePath = 'title' } = props
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
    setTargetValue(sourceValue)
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
    color: 'currentcolor',
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
