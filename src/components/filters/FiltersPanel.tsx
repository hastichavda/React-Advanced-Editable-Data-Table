import { type ColumnFiltersState } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DEPARTMENT_FILTER_OPTIONS } from '../../constants/table'
import { ModernSelect } from '../form/ModernSelect'
import { useTableStore } from '../../store/tableStore'
import type { NumericField } from '../../types/table'
import type { NumberRangeFilter } from '../../table/filterFns'

const getTextFilter = (columnId: string, filters: ColumnFiltersState): string => {
  const match = filters.find((filter) => filter.id === columnId)
  return typeof match?.value === 'string' ? match.value : ''
}

const getRangeFilter = (columnId: string, filters: ColumnFiltersState): NumberRangeFilter => {
  const match = filters.find((filter) => filter.id === columnId)
  return typeof match?.value === 'object' && match.value ? (match.value as NumberRangeFilter) : {}
}

export const FiltersPanel = () => {
  const columnFilters = useTableStore((state) => state.columnFilters)
  const searchQuery = useTableStore((state) => state.searchQuery)
  const searchInput = useTableStore((state) => state.searchInput)
  const setColumnFilters = useTableStore((state) => state.setColumnFilters)
  const clearFilters = useTableStore((state) => state.clearFilters)

  const nameFilter = getTextFilter('name', columnFilters)
  const emailFilter = getTextFilter('email', columnFilters)
  const departmentFilter = getTextFilter('department', columnFilters)
  const salaryFilter = getRangeFilter('salary', columnFilters)
  const quantityFilter = getRangeFilter('quantity', columnFilters)
  const experienceFilter = getRangeFilter('experience', columnFilters)

  const hasActiveFilters = useMemo(
    () =>
      columnFilters.length > 0 ||
      searchQuery.trim().length > 0 ||
      searchInput.trim().length > 0,
    [columnFilters.length, searchQuery, searchInput],
  )

  const setTextFilter = (columnId: string, value: string): void => {
    setColumnFilters((previous) => {
      const next = previous.filter((filter) => filter.id !== columnId)
      if (!value.trim()) {
        return next
      }
      return [...next, { id: columnId, value }]
    })
  }

  const setRangeFilter = (
    columnId: NumericField,
    boundary: 'min' | 'max',
    value: string,
  ): void => {
    setColumnFilters((previous) => {
      const next = previous.filter((filter) => filter.id !== columnId)
      const current = getRangeFilter(columnId, previous)

      const parsed = value.trim() === '' ? undefined : Number(value)
      const range: NumberRangeFilter = {
        ...current,
        [boundary]: Number.isFinite(parsed) ? parsed : undefined,
      }

      if (range.min === undefined && range.max === undefined) {
        return next
      }

      return [...next, { id: columnId, value: range }]
    })
  }

  return (
    <section className="filters-panel" aria-label="Column filters">
      <div className="filters-grid">
        <label>
          Name
          <input
            value={nameFilter}
            onChange={(event) => setTextFilter('name', event.target.value)}
            placeholder="Filter names"
          />
        </label>
        <label>
          Email
          <input
            value={emailFilter}
            onChange={(event) => setTextFilter('email', event.target.value)}
            placeholder="Filter emails"
          />
        </label>
        <label>
          Department
          <ModernSelect
            ariaLabel="Filter department"
            value={departmentFilter}
            options={DEPARTMENT_FILTER_OPTIONS}
            onChange={(nextValue) => setTextFilter('department', nextValue)}
            placeholder="All departments"
          />
        </label>
        <label>
          Salary Min
          <input
            inputMode="numeric"
            value={salaryFilter.min ?? ''}
            onChange={(event) => setRangeFilter('salary', 'min', event.target.value)}
            placeholder="0"
          />
        </label>
        <label>
          Salary Max
          <input
            inputMode="numeric"
            value={salaryFilter.max ?? ''}
            onChange={(event) => setRangeFilter('salary', 'max', event.target.value)}
            placeholder="200000"
          />
        </label>
        <label>
          Quantity Min
          <input
            inputMode="numeric"
            value={quantityFilter.min ?? ''}
            onChange={(event) => setRangeFilter('quantity', 'min', event.target.value)}
            placeholder="0"
          />
        </label>
        <label>
          Quantity Max
          <input
            inputMode="numeric"
            value={quantityFilter.max ?? ''}
            onChange={(event) => setRangeFilter('quantity', 'max', event.target.value)}
            placeholder="500"
          />
        </label>
        <label>
          Experience Min
          <input
            inputMode="decimal"
            value={experienceFilter.min ?? ''}
            onChange={(event) => setRangeFilter('experience', 'min', event.target.value)}
            placeholder="0"
          />
        </label>
        <label>
          Experience Max
          <input
            inputMode="decimal"
            value={experienceFilter.max ?? ''}
            onChange={(event) => setRangeFilter('experience', 'max', event.target.value)}
            placeholder="25"
          />
        </label>
      </div>
      <div className="filters-actions">
        <button type="button" className="outline-btn" onClick={clearFilters} disabled={!hasActiveFilters}>
          Clear filters
        </button>
      </div>
    </section>
  )
}
