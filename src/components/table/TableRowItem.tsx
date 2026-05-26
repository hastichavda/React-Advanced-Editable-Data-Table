import { flexRender, type Row } from '@tanstack/react-table'
import { memo } from 'react'

import { EditableCell } from '../editable-cell/EditableCell'
import { useTableStore } from '../../store/tableStore'
import type { ColumnMeta } from '../../table/columns'
import { isNumericField, type EditableField, type EmployeeRow } from '../../types/table'

interface TableRowItemProps {
  row: Row<EmployeeRow>
  gridTemplateColumns: string
}

export const TableRowItem = memo(({ row, gridTemplateColumns }: TableRowItemProps) => {
  const rowId = row.original.id
  const edit = useTableStore((state) => state.editingRows[rowId])
  const canUndoSaved = useTableStore((state) => Boolean(state.undoHistory[rowId]))

  const startEditing = useTableStore((state) => state.startEditing)
  const cancelEditing = useTableStore((state) => state.cancelEditing)
  const saveEditing = useTableStore((state) => state.saveEditing)
  const undoDraft = useTableStore((state) => state.undoDraft)
  const undoSaved = useTableStore((state) => state.undoSaved)

  const isEditing = Boolean(edit)
  const isSaving = Boolean(edit?.isSaving)
  const canUndoDraft = Boolean(edit?.dirty)

  const handleSave = (): void => {
    if (isSaving) {
      return
    }

    void saveEditing(rowId)
  }

  return (
    <div
      className={`table-row ${isEditing ? 'table-row--editing' : ''}`}
      role="row"
      style={{ gridTemplateColumns }}
    >
      {row.getVisibleCells().map((cell) => {
        const columnId = cell.column.id
        const meta = cell.column.columnDef.meta as ColumnMeta | undefined
        const align = meta?.align ?? 'left'

        if (columnId === 'actions') {
          return (
            <div key={cell.id} className="table-cell table-cell--actions" role="cell">
              {isEditing ? (
                <div className="row-actions">
                  <button
                    type="button"
                    className="action-btn action-btn--save"
                    onClick={handleSave}
                    disabled={isSaving}
                    aria-busy={isSaving}
                    aria-label={isSaving ? 'Saving row' : 'Save row'}
                  >
                    {isSaving ? <span className="action-btn__spinner" aria-hidden /> : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => cancelEditing(rowId)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => undoDraft(rowId)}
                    disabled={!canUndoDraft || isSaving}
                  >
                    Undo
                  </button>
                </div>
              ) : (
                <div className="row-actions">
                  <button
                    type="button"
                    className="action-btn action-btn--save"
                    onClick={() => startEditing(rowId)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => undoSaved(rowId)}
                    disabled={!canUndoSaved}
                  >
                    Undo
                  </button>
                </div>
              )}
            </div>
          )
        }

        if (isEditing && meta?.editable) {
          const field = columnId as EditableField
          const inputType = meta.inputType ?? 'text'
          const draftValue = String(edit?.draft[field] ?? '')
          const error = isNumericField(field) ? edit?.validationErrors[field] : undefined

          return (
            <div
              key={cell.id}
              className={`table-cell table-cell--editable ${align === 'right' ? 'table-cell--right' : ''}`}
              role="cell"
            >
              <EditableCell
                rowId={rowId}
                field={field}
                value={draftValue}
                inputType={inputType}
                align={align}
                error={error}
                disabled={isSaving}
                onSubmit={handleSave}
                onCancel={() => cancelEditing(rowId)}
              />
            </div>
          )
        }

        return (
          <div
            key={cell.id}
            className={`table-cell ${align === 'right' ? 'table-cell--right' : ''}`}
            role="cell"
            title={String(cell.getValue() ?? '')}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        )
      })}
    </div>
  )
})

TableRowItem.displayName = 'TableRowItem'
