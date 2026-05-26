# Advanced Editable Data Table - Formal Technical Documentation

## 1) Project Intent

Build a production-grade frontend table feature for large datasets (10,000+ rows) with:

- inline row editing
- rendering performance under heavy row count
- scalable sorting/filtering architecture
- maintainable, modular code structure
- clear UX and extendability for backend integration

## 2) Acceptance Criteria Traceability

### Editable Table

- **Inline edit controls**: implemented (`Edit`, `Save`, `Cancel`, `Undo`) in `src/components/table/TableRowItem.tsx`
- **Row-level edit isolation**: implemented via per-row `editingRows` in `src/store/tableStore.ts`
- **Cancel/undo support**:
  - cancel draft edits (`cancelEditing`)
  - undo draft (`undoDraftChanges`)
  - undo last saved row (`undoSavedChanges`)
- **Numeric validation**: implemented in `src/utils/validation.ts`
- **Immutable updates**: save path replaces only target row index immutably

### Large Dataset Optimization

- **10,000 mock rows**: generated with deterministic seed in `src/services/mockDataService.ts`
- **Virtual scrolling**: `react-window` `List` in `src/components/table/DataTable.tsx`
- **Pagination fallback**: toggleable mode with controls in `src/components/pagination/PaginationControls.tsx`
- **Memoized row/cell paths**: row rendering split into focused components; row state updates isolated
- **Stable IDs/keys**: persistent `id` values and indexed map `rowIndexById`

### Sorting and Filtering

- **Multi-column sorting**: TanStack sorting enabled with shift-click behavior
- **Text filtering**: global + per-column text filters
- **Numeric range filtering**: custom range filter function in `src/table/filterFns.ts`
- **Responsive search UX**: debounced global search in `src/hooks/useDebouncedValue.ts`
- **Clear filters action**: implemented in `FiltersPanel`

### State Management

- **Lightweight global state**: Zustand store (`src/store/tableStore.ts`)
- **State separation**:
  - data
  - editing drafts/errors
  - sorting/filtering
  - pagination/mode
  - column visibility
  - unsaved changes indicator

### UI/UX

- clean responsive layout in `src/index.css`
- sticky table header and scrollable body
- loading and empty states
- keyboard handling in edit inputs (`Enter` save, `Escape` cancel)
- focus/hover/disabled states

### Bonus Features

- **CSV export**: filtered/all export with visible column preservation in `src/utils/csv.ts`
- **Unsaved changes protection**: `beforeunload` guard in `src/hooks/useUnsavedChangesGuard.ts`

## 3) Current Runtime Workflow

### App Initialization

1. `DataTablePage` mounts.
2. `fetchMockEmployees(10000)` simulates async data fetch.
3. Store receives rows via `loadData`.
4. Loading state switches to main table render.

### User Data Flow

1. TanStack row models derive sorted/filtered/paged rows from store state.
2. Rendering mode decides between:
   - virtualized row list
   - paginated row slice
3. Row actions update store methods directly (no prop drilling chain).

### Edit Lifecycle (Per Row)

1. `Edit` creates isolated draft copy.
2. Draft keystrokes update only that row's draft state.
3. `Save` validates and commits immutable row replacement.
4. Undo history stores previous committed row snapshot.

## 4) Module Responsibilities

- `src/pages/DataTablePage.tsx`: app bootstrap and loading gate
- `src/components/table/*`: orchestration, toolbar, header, rows
- `src/components/filters/FiltersPanel.tsx`: column-level filter controls
- `src/components/editable-cell/EditableCell.tsx`: input rendering and keyboard edit controls
- `src/store/tableStore.ts`: business state and actions
- `src/table/columns.ts`: schema-level column config
- `src/table/filterFns.ts`: reusable filter behavior
- `src/services/mockDataService.ts`: dataset generation service
- `src/utils/*`: formatting, validation, csv export
- `src/types/table.ts`: domain types and edit-state contracts

## 5) Extensibility Strategy

### Backend Integration

- replace `mockDataService` with API client
- keep row edit contract and validation flow unchanged
- optionally move filtering/sorting/pagination server-side while preserving UI contracts

### Table Schema Growth

- add new field in `EmployeeRow`
- update column definition in `columns.ts`
- extend edit/validation logic only when field is editable

### Performance Scaling Beyond Current Scope

- move to server-side filtering/sorting for 100k+ datasets
- progressive row fetching and windowed caching
- column virtualization if column count becomes large

## 6) Known Constraints

- current undo history is one-level per row (last committed state)
- department filter uses includes-style matching, not strict enum mode
- keyboard navigation is row-edit focused, not spreadsheet-style cell navigation

