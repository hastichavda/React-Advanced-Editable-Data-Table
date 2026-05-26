# Implementation Roadmap and To-Do Order

This roadmap organizes next development in execution order, module-wise, so work can be tracked as delivery milestones.

## Phase 0 - Environment and Baseline

- [x] Initialize Vite + React + TypeScript scaffold
- [x] Add required dependencies (`@tanstack/react-table`, `react-window`, `zustand`)
- [x] Configure core project structure
- [x] Verify lint/build pipeline

## Phase 1 - Data and Type Foundations

### Modules

- `src/types/table.ts`
- `src/constants/table.ts`
- `src/services/mockDataService.ts`

### To-Do

- [x] Define domain model and edit-state types
- [x] Define constants (row count, row height, paging defaults)
- [x] Implement deterministic mock dataset generator
- [x] Add async-style fetch boundary for future API replacement

## Phase 2 - State Architecture

### Modules

- `src/store/tableStore.ts`

### To-Do

- [x] Build lightweight Zustand store
- [x] Separate concerns: table state vs editing state vs undo state
- [x] Implement row-index mapping for targeted row updates
- [x] Add row-level edit lifecycle actions
- [x] Add global unsaved-changes selector

## Phase 3 - Table Engine and Configuration

### Modules

- `src/table/columns.ts`
- `src/table/filterFns.ts`
- `src/components/table/DataTable.tsx`

### To-Do

- [x] Centralize column schema with metadata
- [x] Implement custom numeric range filtering
- [x] Wire TanStack sorting/filtering/pagination models
- [x] Add column visibility controls and CSV export bridge

## Phase 4 - Editing Experience

### Modules

- `src/components/editable-cell/EditableCell.tsx`
- `src/components/table/TableRowItem.tsx`
- `src/utils/validation.ts`

### To-Do

- [x] Implement inline editable cell variants (text/select/number)
- [x] Handle keyboard save/cancel behavior
- [x] Validate numeric inputs with domain limits
- [x] Support save/cancel/undo at row level

## Phase 5 - Filtering and Control UX

### Modules

- `src/components/table/TableToolbar.tsx`
- `src/components/filters/FiltersPanel.tsx`
- `src/hooks/useDebouncedValue.ts`

### To-Do

- [x] Add global search with debounce
- [x] Add column-level text/range filters
- [x] Add clear filter action and row count badges
- [x] Add mode switch (virtualized vs pagination)

## Phase 6 - Rendering Performance

### Modules

- `src/components/table/DataTable.tsx`
- `src/components/pagination/PaginationControls.tsx`

### To-Do

- [x] Integrate virtualization for high row counts
- [x] Keep pagination fallback mode for review scenarios
- [x] Keep stable row identity and segmented rendering
- [x] Ensure smooth rendering under filter/sort updates

## Phase 7 - Safety, Export, and Documentation

### Modules

- `src/utils/csv.ts`
- `src/hooks/useUnsavedChangesGuard.ts`
- `README.md`
- `docs/*`

### To-Do

- [x] Export filtered/all rows as CSV with visible columns
- [x] Warn on tab close/refresh with unsaved edits
- [x] Write setup and architecture documentation
- [x] Create formal referral-ready technical documents

## Next Priority Backlog (Suggested)

### P1 - High Value

- [ ] Add automated tests (unit + component + integration)
- [ ] Add strict email/text validation with user-visible error states
- [ ] Add keyboard traversal across editable cells

### P2 - Scale Enhancements

- [ ] Add server-side pagination/sorting/filtering contract
- [ ] Add API error handling and retry strategy
- [ ] Add optimistic update + rollback integration

### P3 - Product Polish

- [ ] Persist user preferences (column visibility, mode, page size)
- [ ] Add audit metadata columns (`updatedAt`, `updatedBy`)
- [ ] Add role-based field editability

