import type { Department } from '../types/table'

export const TOTAL_MOCK_ROWS = 10_000
export const VIRTUAL_TABLE_HEIGHT = 560
export const ROW_HEIGHT = 52
export const DEFAULT_PAGE_SIZE = 100
export const PAGE_SIZE_OPTIONS = [25, 50, 100, 250]
export const SEARCH_DEBOUNCE_MS = 180

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Success',
]

export const NUMERIC_FIELDS = ['salary', 'quantity', 'experience'] as const

export const DEPARTMENT_EDIT_OPTIONS = DEPARTMENTS.map((department) => ({
  value: department,
  label: department,
}))

export const DEPARTMENT_FILTER_OPTIONS = [
  { value: '', label: 'All departments' },
  ...DEPARTMENT_EDIT_OPTIONS,
]
