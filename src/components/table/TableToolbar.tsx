import { useEffect } from 'react'

import { SEARCH_DEBOUNCE_MS } from '../../constants/table'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { countUnsavedEdits, useTableStore } from '../../store/tableStore'
import { DropdownMenu } from '../form/DropdownMenu'

interface ColumnOption {
  id: string
  label: string
  canHide: boolean
}

interface TableToolbarProps {
  totalRows: number
  filteredRows: number
  onExportFiltered: () => void
  onExportAll: () => void
  columnOptions: ColumnOption[]
}

export const TableToolbar = ({
  totalRows,
  filteredRows,
  onExportFiltered,
  onExportAll,
  columnOptions,
}: TableToolbarProps) => {
  const searchQuery = useTableStore((state) => state.searchQuery)
  const searchInput = useTableStore((state) => state.searchInput)
  const setSearchQuery = useTableStore((state) => state.setSearchQuery)
  const setSearchInput = useTableStore((state) => state.setSearchInput)
  const setPaginated = useTableStore((state) => state.setPaginated)
  const isPaginated = useTableStore((state) => state.isPaginated)
  const setColumnVisibility = useTableStore((state) => state.setColumnVisibility)
  const columnVisibility = useTableStore((state) => state.columnVisibility)
  const unsavedEdits = useTableStore(countUnsavedEdits)

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      setSearchQuery(debouncedSearch)
    }
  }, [debouncedSearch, searchQuery, setSearchQuery])

  return (
    <section className="table-toolbar" aria-label="Table toolbar">
      <div className="toolbar-row">
        <div className="toolbar-search">
          <label htmlFor="global-search">Search</label>
          <input
            id="global-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search all columns"
          />
        </div>

        <div className="toolbar-stats" aria-live="polite">
          <span className="badge">{filteredRows.toLocaleString()} filtered</span>
          <span className="badge">{totalRows.toLocaleString()} total</span>
          <span className={`badge ${unsavedEdits > 0 ? 'badge--warning' : ''}`}>
            {unsavedEdits} unsaved
          </span>
        </div>
      </div>

      <div className="toolbar-row toolbar-row--actions">
        <div className="mode-switch" role="group" aria-label="Rendering mode">
          <button
            type="button"
            className={!isPaginated ? 'mode-switch__btn active' : 'mode-switch__btn'}
            onClick={() => setPaginated(false)}
          >
            Virtual scroll
          </button>
          <button
            type="button"
            className={isPaginated ? 'mode-switch__btn active' : 'mode-switch__btn'}
            onClick={() => setPaginated(true)}
          >
            Paginated
          </button>
        </div>

        <div className="toolbar-actions">
          <DropdownMenu triggerLabel="Columns" ariaLabel="Column visibility menu">
            <div className="column-menu__content">
              {columnOptions.map((column) => (
                <label key={column.id} className="column-menu__item">
                  <input
                    type="checkbox"
                    checked={columnVisibility[column.id] ?? true}
                    disabled={!column.canHide}
                    onChange={(event) =>
                      setColumnVisibility((previous) => ({
                        ...previous,
                        [column.id]: event.target.checked,
                      }))
                    }
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </DropdownMenu>

          <button type="button" className="outline-btn" onClick={onExportFiltered}>
            Export filtered CSV
          </button>
          <button type="button" className="outline-btn" onClick={onExportAll}>
            Export all CSV
          </button>
        </div>
      </div>
    </section>
  )
}
