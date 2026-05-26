import type { EmployeeRow, NumericField, RowDraft } from '../types/table'

const NUMERIC_INPUT_PATTERN = /^$|^\d*\.?\d*$/

export const rowToDraft = (row: EmployeeRow): RowDraft => ({
  ...row,
  salary: String(row.salary),
  quantity: String(row.quantity),
  experience: String(row.experience),
})

export const isValidNumericInput = (value: string): boolean =>
  NUMERIC_INPUT_PATTERN.test(value)

export const isDraftDirty = (draft: RowDraft, original: EmployeeRow): boolean => {
  const baseline = rowToDraft(original)

  return (
    draft.name !== baseline.name ||
    draft.email !== baseline.email ||
    draft.department !== baseline.department ||
    draft.salary !== baseline.salary ||
    draft.quantity !== baseline.quantity ||
    draft.experience !== baseline.experience
  )
}

const parseNumericField = (
  field: NumericField,
  value: string,
): { parsed?: number; error?: string } => {
  if (value.trim() === '') {
    return { error: 'Required value' }
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return { error: 'Must be a valid number' }
  }

  switch (field) {
    case 'salary':
      if (parsed <= 0 || parsed > 1_000_000) {
        return { error: 'Salary must be between 1 and 1,000,000' }
      }
      return { parsed: Math.round(parsed) }
    case 'quantity':
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 1_000) {
        return { error: 'Quantity must be an integer between 0 and 1,000' }
      }
      return { parsed }
    case 'experience':
      if (parsed < 0 || parsed > 50) {
        return { error: 'Experience must be between 0 and 50 years' }
      }
      return { parsed: Number(parsed.toFixed(1)) }
    default:
      return { parsed }
  }
}

export const validateAndParseDraft = (
  draft: RowDraft,
  original: EmployeeRow,
): {
  parsedRow?: EmployeeRow
  errors: Partial<Record<NumericField, string>>
} => {
  const errors: Partial<Record<NumericField, string>> = {}

  const salaryResult = parseNumericField('salary', draft.salary)
  const quantityResult = parseNumericField('quantity', draft.quantity)
  const experienceResult = parseNumericField('experience', draft.experience)

  if (salaryResult.error) {
    errors.salary = salaryResult.error
  }
  if (quantityResult.error) {
    errors.quantity = quantityResult.error
  }
  if (experienceResult.error) {
    errors.experience = experienceResult.error
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  return {
    errors: {},
    parsedRow: {
      ...original,
      name: draft.name.trim(),
      email: draft.email.trim(),
      department: draft.department,
      salary: salaryResult.parsed ?? original.salary,
      quantity: quantityResult.parsed ?? original.quantity,
      experience: experienceResult.parsed ?? original.experience,
    },
  }
}
