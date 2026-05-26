import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Updater,
  type VisibilityState,
  functionalUpdate,
} from '@tanstack/react-table'
import { create } from 'zustand'

import { DEFAULT_PAGE_SIZE } from '../constants/table'
import { saveMockEmployeeRow } from '../services/mockDataService'
import {
  isNumericField,
  type EditableField,
  type EmployeeRow,
  type RowEdit,
  type SaveRowResult,
} from '../types/table'
import {
  isDraftDirty,
  isValidNumericInput,
  rowToDraft,
  validateAndParseDraft,
} from '../utils/validation'

interface TableStore {
  data: EmployeeRow[]
  loading: boolean
  sorting: SortingState
  columnFilters: ColumnFiltersState
  searchQuery: string
  searchInput: string
  pagination: PaginationState
  isPaginated: boolean
  columnVisibility: VisibilityState
  editingRows: Record<string, RowEdit>
  undoHistory: Record<string, EmployeeRow>
  rowIndexes: Record<string, number>
  loadData: (rows: EmployeeRow[]) => void
  setLoading: (loading: boolean) => void
  setSorting: (updater: Updater<SortingState>) => void
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  setSearchQuery: (value: string) => void
  setSearchInput: (value: string) => void
  setPagination: (updater: Updater<PaginationState>) => void
  setPaginated: (enabled: boolean) => void
  setColumnVisibility: (updater: Updater<VisibilityState>) => void
  clearFilters: () => void
  startEditing: (rowId: string) => void
  updateDraftField: (rowId: string, field: EditableField, value: string) => void
  undoDraft: (rowId: string) => void
  cancelEditing: (rowId: string) => void
  saveEditing: (rowId: string) => Promise<SaveRowResult>
  undoSaved: (rowId: string) => void
}

const indexRowsById = (rows: EmployeeRow[]): Record<string, number> => {
  const indexes: Record<string, number> = {}

  rows.forEach((row, index) => {
    indexes[row.id] = index
  })

  return indexes
}

export const useTableStore = create<TableStore>((set, get) => ({
  data: [],
  loading: true,
  sorting: [],
  columnFilters: [],
  searchQuery: '',
  searchInput: '',
  pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
  isPaginated: false,
  columnVisibility: {},
  editingRows: {},
  undoHistory: {},
  rowIndexes: {},
  loadData: (rows) =>
    set({
      data: rows,
      rowIndexes: indexRowsById(rows),
      loading: false,
      pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
    }),
  setLoading: (loading) => set({ loading }),
  setSorting: (updater) =>
    set((state) => ({ sorting: functionalUpdate(updater, state.sorting) })),
  setColumnFilters: (updater) =>
    set((state) => ({
      columnFilters: functionalUpdate(updater, state.columnFilters),
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setSearchQuery: (value) =>
    set((state) => ({
      searchQuery: value,
      searchInput: value,
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setSearchInput: (value) => set({ searchInput: value }),
  setPagination: (updater) =>
    set((state) => ({ pagination: functionalUpdate(updater, state.pagination) })),
  setPaginated: (enabled) => set({ isPaginated: enabled }),
  setColumnVisibility: (updater) =>
    set((state) => ({
      columnVisibility: functionalUpdate(updater, state.columnVisibility),
    })),
  clearFilters: () =>
    set((state) => ({
      searchQuery: '',
      searchInput: '',
      columnFilters: [],
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  startEditing: (rowId) =>
    set((state) => {
      if (state.editingRows[rowId]) {
        return state
      }

      const rowIndex = state.rowIndexes[rowId]
      const row = state.data[rowIndex]
      if (!row) {
        return state
      }

      return {
        editingRows: {
          ...state.editingRows,
          [rowId]: {
            original: row,
            draft: rowToDraft(row),
            dirty: false,
            validationErrors: {},
          },
        },
      }
    }),
  updateDraftField: (rowId, field, value) =>
    set((state) => {
      const edit = state.editingRows[rowId]
      if (!edit) {
        return state
      }

      if (isNumericField(field) && !isValidNumericInput(value)) {
        return state
      }

      const draft = { ...edit.draft, [field]: value }
      const dirty = isDraftDirty(draft, edit.original)
      const validationErrors = { ...edit.validationErrors }

      if (isNumericField(field)) {
        delete validationErrors[field]
      }

      return {
        editingRows: {
          ...state.editingRows,
          [rowId]: {
            ...edit,
            draft,
            dirty,
            validationErrors,
          },
        },
      }
    }),
  undoDraft: (rowId) =>
    set((state) => {
      const edit = state.editingRows[rowId]
      if (!edit) {
        return state
      }

      return {
        editingRows: {
          ...state.editingRows,
          [rowId]: {
            ...edit,
            draft: rowToDraft(edit.original),
            dirty: false,
            validationErrors: {},
          },
        },
      }
    }),
  cancelEditing: (rowId) =>
    set((state) => {
      if (!state.editingRows[rowId]) {
        return state
      }

      const editingRows = { ...state.editingRows }
      delete editingRows[rowId]

      return { editingRows }
    }),
  saveEditing: async (rowId) => {
    const { editingRows, rowIndexes } = get()
    const edit = editingRows[rowId]

    if (!edit) {
      return { success: false, error: 'Row is not in edit mode.' }
    }

    if (edit.isSaving) {
      return { success: false, error: 'Save already in progress.' }
    }

    const validation = validateAndParseDraft(edit.draft, edit.original)

    if (!validation.parsedRow) {
      set((state) => ({
        editingRows: {
          ...state.editingRows,
          [rowId]: {
            ...edit,
            validationErrors: validation.errors,
          },
        },
      }))

      return {
        success: false,
        error: 'Please fix validation errors before saving.',
      }
    }

    const rowIndex = rowIndexes[rowId]
    if (rowIndex === undefined) {
      return { success: false, error: 'Unable to locate row data.' }
    }

    set((state) => ({
      editingRows: {
        ...state.editingRows,
        [rowId]: {
          ...edit,
          isSaving: true,
        },
      },
    }))

    try {
      const savedRow = await saveMockEmployeeRow(validation.parsedRow)

      set((state) => {
        const data = [...state.data]
        const previousRow = data[rowIndex]
        data[rowIndex] = savedRow

        const nextEditingRows = { ...state.editingRows }
        delete nextEditingRows[rowId]

        return {
          data,
          editingRows: nextEditingRows,
          undoHistory: {
            ...state.undoHistory,
            [rowId]: previousRow,
          },
        }
      })

      return { success: true }
    } catch {
      set((state) => ({
        editingRows: {
          ...state.editingRows,
          [rowId]: {
            ...state.editingRows[rowId],
            isSaving: false,
          },
        },
      }))

      return { success: false, error: 'Unable to save changes. Please try again.' }
    }
  },
  undoSaved: (rowId) =>
    set((state) => {
      const previousRow = state.undoHistory[rowId]
      const rowIndex = state.rowIndexes[rowId]

      if (!previousRow || rowIndex === undefined) {
        return state
      }

      const data = [...state.data]
      data[rowIndex] = previousRow

      const undoHistory = { ...state.undoHistory }
      delete undoHistory[rowId]

      return { data, undoHistory }
    }),
}))

export const countUnsavedEdits = (state: TableStore): number =>
  Object.values(state.editingRows).filter((edit) => edit.dirty).length
