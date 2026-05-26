import type { ColumnDef } from '@tanstack/react-table'

import type { EmployeeRow } from '../types/table'
import { numberRangeFilterFn } from './filterFns'
import { formatCurrency, formatExperience, formatInteger } from '../utils/format'

export interface ColumnMeta {
  label: string
  align?: 'left' | 'right'
  editable?: boolean
  inputType?: 'text' | 'number' | 'select'
}

export const getColumnLabel = (column: { id: string; columnDef: { meta?: unknown } }): string =>
  (column.columnDef.meta as ColumnMeta | undefined)?.label ?? column.id

export const columns: ColumnDef<EmployeeRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 220,
    filterFn: 'includesString',
    meta: {
      label: 'Name',
      editable: true,
      inputType: 'text',
    } satisfies ColumnMeta,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 280,
    filterFn: 'includesString',
    meta: {
      label: 'Email',
      editable: true,
      inputType: 'text',
    } satisfies ColumnMeta,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 190,
    filterFn: 'includesString',
    meta: {
      label: 'Department',
      editable: true,
      inputType: 'select',
    } satisfies ColumnMeta,
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    size: 150,
    filterFn: numberRangeFilterFn,
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
    meta: {
      label: 'Salary',
      align: 'right',
      editable: true,
      inputType: 'number',
    } satisfies ColumnMeta,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    size: 130,
    filterFn: numberRangeFilterFn,
    cell: ({ getValue }) => formatInteger(getValue<number>()),
    meta: {
      label: 'Quantity',
      align: 'right',
      editable: true,
      inputType: 'number',
    } satisfies ColumnMeta,
  },
  {
    accessorKey: 'experience',
    header: 'Experience',
    size: 150,
    filterFn: numberRangeFilterFn,
    cell: ({ getValue }) => formatExperience(getValue<number>()),
    meta: {
      label: 'Experience',
      align: 'right',
      editable: true,
      inputType: 'number',
    } satisfies ColumnMeta,
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 240,
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: () => null,
    meta: {
      label: 'Actions',
      editable: false,
    } satisfies ColumnMeta,
  },
]
