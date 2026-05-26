import type { Table } from '@tanstack/react-table'
import { useMemo } from 'react'

import { PAGE_SIZE_OPTIONS } from '../../constants/table'
import type { EmployeeRow } from '../../types/table'
import { ModernSelect, type SelectOption } from '../form/ModernSelect'

interface PaginationControlsProps {
  table: Table<EmployeeRow>
}

export const PaginationControls = ({ table }: PaginationControlsProps) => {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const pageSizeOptions = useMemo<SelectOption[]>(
    () =>
      PAGE_SIZE_OPTIONS.map((option) => ({
        label: String(option),
        value: String(option),
      })),
    [],
  )

  return (
    <div className="pagination-controls" aria-label="Pagination controls">
      <div className="pagination-meta">
        <span>
          Page {pageIndex + 1} of {Math.max(pageCount, 1)}
        </span>
        <label>
          Rows per page
          <ModernSelect
            ariaLabel="Rows per page"
            size="compact"
            className="pagination-select"
            value={String(pageSize)}
            options={pageSizeOptions}
            onChange={(nextValue) => table.setPageSize(Number(nextValue))}
          />
        </label>
      </div>

      <div className="pagination-actions">
        <button type="button" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          First
        </button>
        <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
        <button type="button" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          Last
        </button>
      </div>
    </div>
  )
}
