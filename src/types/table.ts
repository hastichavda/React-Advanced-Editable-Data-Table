export type Department =
  | 'Engineering'
  | 'Product'
  | 'Design'
  | 'Marketing'
  | 'Sales'
  | 'Finance'
  | 'Operations'
  | 'Customer Success'

export interface EmployeeRow {
  id: string
  name: string
  email: string
  department: Department
  salary: number
  quantity: number
  experience: number
}

export type NumericField = 'salary' | 'quantity' | 'experience'
export type EditableField = Exclude<keyof EmployeeRow, 'id'>

export type RowDraft = Omit<EmployeeRow, NumericField> & Record<NumericField, string>

export interface RowEdit {
  original: EmployeeRow
  draft: RowDraft
  dirty: boolean
  validationErrors: Partial<Record<NumericField, string>>
  isSaving?: boolean
}

export interface SaveRowResult {
  success: boolean
  error?: string
}

export function isNumericField(field: EditableField): field is NumericField {
  return field === 'salary' || field === 'quantity' || field === 'experience'
}
