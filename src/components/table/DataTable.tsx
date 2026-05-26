import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { List, type RowComponentProps } from 'react-window'

import { FiltersPanel } from '../filters/FiltersPanel'
import { PaginationControls } from '../pagination/PaginationControls'
import { ROW_HEIGHT, VIRTUAL_TABLE_HEIGHT } from '../../constants/table'
import { useTableStore } from '../../store/tableStore'
import { columns, getColumnLabel } from '../../table/columns'
import { matchesGlobalSearch, numberRangeFilterFn } from '../../table/filterFns'
import type { EmployeeRow } from '../../types/table'
import { exportRowsToCsv } from '../../utils/csv'
import { TableHeaderRow } from './TableHeaderRow'
import { TableRowItem } from './TableRowItem'
import { TableToolbar } from './TableToolbar'

interface ListRowProps {
  rows: Row<EmployeeRow>[]
  gridTemplateColumns: string
}

const ListRow = ({ index, style, rows, gridTemplateColumns }: RowComponentProps<ListRowProps>) => {
  const rowId = rows[index]?.original.id
  const isEditing = useTableStore((state) =>
    rowId ? Boolean(state.editingRows[rowId]) : false,
  )

  return (
    <div
      className="virtualized-table-row"
      style={{ ...style, zIndex: isEditing ? 20 : style.zIndex }}
    >
      <TableRowItem row={rows[index]} gridTemplateColumns={gridTemplateColumns} />
    </div>
  )
}

export const DataTable = () => {
  const data = useTableStore((state) => state.data)
  const sorting = useTableStore((state) => state.sorting)
  const columnFilters = useTableStore((state) => state.columnFilters)
  const searchQuery = useTableStore((state) => state.searchQuery)
  const pagination = useTableStore((state) => state.pagination)
  const isPaginated = useTableStore((state) => state.isPaginated)
  const columnVisibility = useTableStore((state) => state.columnVisibility)

  const setSorting = useTableStore((state) => state.setSorting)
  const setColumnFilters = useTableStore((state) => state.setColumnFilters)
  const setSearchQuery = useTableStore((state) => state.setSearchQuery)
  const setPagination = useTableStore((state) => state.setPagination)
  const setColumnVisibility = useTableStore((state) => state.setColumnVisibility)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchQuery,
      pagination,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchQuery,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      numberRange: numberRangeFilterFn,
    },
    globalFilterFn: matchesGlobalSearch,
  })

  const rows = isPaginated ? table.getRowModel().rows : table.getPrePaginationRowModel().rows
  const filteredRows = table.getFilteredRowModel().rows.length
  const totalRows = data.length

  const visibleColumns = table.getVisibleLeafColumns()
  const gridTemplateColumns = visibleColumns
    .map((column) => `${column.getSize()}px`)
    .join(' ')
  const tableWidth = visibleColumns.reduce((total, column) => total + column.getSize(), 0)

  const columnOptions = useMemo(
    () =>
      table.getAllLeafColumns().map((column) => ({
        id: column.id,
        label: getColumnLabel(column),
        canHide: column.getCanHide(),
      })),
    [table],
  )

  const csvColumns = useMemo(
    () =>
      visibleColumns
        .filter((column) => column.id !== 'actions')
        .map((column) => ({
          id: column.id as keyof EmployeeRow,
          label: getColumnLabel(column),
        })),
    [visibleColumns],
  )

  const exportFilteredRows = (): void => {
    const filteredData = table.getPrePaginationRowModel().rows.map((row) => row.original)
    exportRowsToCsv(filteredData, csvColumns, 'filtered-rows.csv')
  }

  const exportAllRows = (): void => {
    exportRowsToCsv(data, csvColumns, 'all-rows.csv')
  }

  return (
    <div className="table-page">
      <header className="page-header">
        <h1>Advanced Editable Data Table</h1>
        <p>
          Inline row editing with isolated state, multi-sort, scalable filtering, CSV
          export, and rendering optimized for 10,000+ rows.
        </p>
      </header>

      <TableToolbar
        totalRows={totalRows}
        filteredRows={filteredRows}
        onExportAll={exportAllRows}
        onExportFiltered={exportFilteredRows}
        columnOptions={columnOptions}
      />

      <FiltersPanel />

      <section className="table-shell" aria-label="Editable employee table">
        <div className="table-scroll-x">
          <div className="table-grid" style={{ minWidth: tableWidth }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeaderRow
                key={headerGroup.id}
                headerGroup={headerGroup}
                gridTemplateColumns={gridTemplateColumns}
              />
            ))}

            {rows.length === 0 ? (
              <div className="empty-state">
                <p>No rows found for the current filters.</p>
                <span>Try clearing filters or broadening the search criteria.</span>
              </div>
            ) : isPaginated ? (
              <div className="table-body table-body--paginated">
                {rows.map((row) => (
                  <TableRowItem key={row.id} row={row} gridTemplateColumns={gridTemplateColumns} />
                ))}
              </div>
            ) : (
              <List
                className="virtualized-list"
                rowCount={rows.length}
                rowHeight={ROW_HEIGHT}
                rowComponent={ListRow}
                rowProps={{ rows, gridTemplateColumns }}
                overscanCount={8}
                style={{ height: VIRTUAL_TABLE_HEIGHT }}
              />
            )}
          </div>
        </div>
      </section>

      {isPaginated ? <PaginationControls table={table} /> : null}
    </div>
  )
}
