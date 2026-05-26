import { flexRender, type HeaderGroup } from '@tanstack/react-table'
import { memo } from 'react'

import type { EmployeeRow } from '../../types/table'

interface TableHeaderRowProps {
  headerGroup: HeaderGroup<EmployeeRow>
  gridTemplateColumns: string
}

const sortIndicator = (direction: false | 'asc' | 'desc'): string => {
  if (direction === 'asc') {
    return '↑'
  }
  if (direction === 'desc') {
    return '↓'
  }
  return '↕'
}

export const TableHeaderRow = memo(
  ({ headerGroup, gridTemplateColumns }: TableHeaderRowProps) => (
    <div
      className="table-header-row"
      role="row"
      style={{ gridTemplateColumns }}
      key={headerGroup.id}
    >
      {headerGroup.headers.map((header) => {
        if (header.isPlaceholder) {
          return <div key={header.id} className="table-header-cell" />
        }

        const canSort = header.column.getCanSort()
        const sorted = header.column.getIsSorted()

        return (
          <div
            key={header.id}
            className={`table-header-cell ${canSort ? 'table-header-cell--sortable' : ''}`}
            role="columnheader"
          >
            {canSort ? (
              <button
                type="button"
                className="sort-btn"
                onClick={header.column.getToggleSortingHandler()}
                title="Click to sort. Shift+Click for multi-column sort."
              >
                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                <span aria-hidden>{sortIndicator(sorted)}</span>
              </button>
            ) : (
              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
            )}
          </div>
        )
      })}
    </div>
  ),
)

TableHeaderRow.displayName = 'TableHeaderRow'
