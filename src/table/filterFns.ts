import type { FilterFn } from '@tanstack/react-table'

import type { EmployeeRow } from '../types/table'

export interface NumberRangeFilter {
  min?: number
  max?: number
}

export const numberRangeFilterFn: FilterFn<EmployeeRow> = (
  row,
  columnId,
  filterValue: NumberRangeFilter,
) => {
  if (!filterValue) {
    return true
  }

  const value = Number(row.getValue(columnId))
  if (!Number.isFinite(value)) {
    return false
  }

  if (typeof filterValue.min === 'number' && value < filterValue.min) {
    return false
  }
  if (typeof filterValue.max === 'number' && value > filterValue.max) {
    return false
  }

  return true
}

numberRangeFilterFn.autoRemove = (filterValue: NumberRangeFilter | undefined) =>
  !filterValue || (filterValue.min === undefined && filterValue.max === undefined)

export const matchesGlobalSearch: FilterFn<EmployeeRow> = (row, _columnId, filterValue: string) => {
  const query = filterValue.trim().toLowerCase()
  if (!query) {
    return true
  }

  const { name, email, department, salary, quantity, experience } = row.original

  return (
    name.toLowerCase().includes(query) ||
    email.toLowerCase().includes(query) ||
    department.toLowerCase().includes(query) ||
    String(salary).includes(query) ||
    String(quantity).includes(query) ||
    String(experience).includes(query)
  )
}
