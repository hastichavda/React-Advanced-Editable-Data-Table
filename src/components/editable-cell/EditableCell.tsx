import { memo, type KeyboardEvent } from 'react'

import { DEPARTMENT_EDIT_OPTIONS } from '../../constants/table'
import { useTableStore } from '../../store/tableStore'
import type { EditableField } from '../../types/table'
import { ModernSelect } from '../form/ModernSelect'

interface EditableCellProps {
  rowId: string
  field: EditableField
  value: string
  inputType: 'text' | 'number' | 'select'
  align?: 'left' | 'right'
  error?: string
  disabled?: boolean
  onSubmit: () => void
  onCancel: () => void
}

export const EditableCell = memo(
  ({
    rowId,
    field,
    value,
    inputType,
    align = 'left',
    error,
    disabled = false,
    onSubmit,
    onCancel,
  }: EditableCellProps) => {
    const updateDraftField = useTableStore((state) => state.updateDraftField)

    const handleChange = (nextValue: string): void => {
      updateDraftField(rowId, field, nextValue)
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (disabled) {
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        onSubmit()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }

    if (inputType === 'select') {
      return (
        <div className="editable-cell-wrapper">
          <ModernSelect
            className="table-select-modern"
            value={value}
            onChange={handleChange}
            options={DEPARTMENT_EDIT_OPTIONS}
            size="compact"
            disabled={disabled}
            onEnterKey={disabled ? undefined : onSubmit}
            onEscapeKey={onCancel}
            ariaLabel={`Edit ${field}`}
          />
        </div>
      )
    }

    return (
      <div className="editable-cell-wrapper">
        <input
          className={`table-input ${error ? 'table-input--error' : ''}`}
          style={{ textAlign: align }}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          inputMode={inputType === 'number' ? 'decimal' : 'text'}
          aria-invalid={Boolean(error)}
          aria-label={`Edit ${field}`}
          disabled={disabled}
        />
        {error ? <span className="table-input-error">{error}</span> : null}
      </div>
    )
  },
)

EditableCell.displayName = 'EditableCell'
