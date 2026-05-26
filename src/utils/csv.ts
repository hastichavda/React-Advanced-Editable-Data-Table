import type { EmployeeRow } from '../types/table'

export interface CsvColumn {
  id: keyof EmployeeRow
  label: string
}

const escapeCsvValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

const toStringValue = (value: EmployeeRow[keyof EmployeeRow]): string =>
  typeof value === 'number' ? String(value) : value

export const exportRowsToCsv = (
  rows: EmployeeRow[],
  columns: CsvColumn[],
  fileName: string,
): void => {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',')
  const body = rows
    .map((row) =>
      columns
        .map((column) => escapeCsvValue(toStringValue(row[column.id])))
        .join(','),
    )
    .join('\n')

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
