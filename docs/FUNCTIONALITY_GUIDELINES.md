# Functionality Guidelines - Current Development

## End-User Usage Guide

### 1) Table Modes

- **Virtualized mode** (default): best for very large row sets; renders only visible rows.
- **Pagination mode**: fallback mode with page controls (`First`, `Previous`, `Next`, `Last`).

### 2) Editing a Row

1. Click `Edit` on target row.
2. Update editable fields inline.
3. Use:
   - `Save` to persist row changes
   - `Cancel` to leave edit mode without applying draft
   - `Undo` (while editing) to reset draft to row original
4. Use `Undo` (outside edit mode) to roll back last saved change for that row.

Keyboard support:

- `Enter`: save active row
- `Escape`: cancel edit mode for active row

### 3) Filtering and Search

- Global search applies across key columns (debounced for responsiveness).
- Column filters:
  - name/email/department text filters
  - salary/quantity/experience min/max range filters
- `Clear filters` resets global + column filters.

### 4) Sorting

- Click a column header to toggle sort direction.
- Use `Shift + Click` to multi-sort by additional columns.

### 5) CSV Export

- `Export filtered CSV`: exports current filtered result set.
- `Export all CSV`: exports all table rows.
- Both exports preserve currently visible columns (actions column excluded).

### 6) Unsaved Changes Safety

- Unsaved edit drafts are tracked globally.
- Browser warns on refresh/close/navigation away when unsaved drafts exist.

## Engineering Guidelines for Future Changes

### State and Update Rules

- Keep business logic in store and utilities, not in JSX render blocks.
- Avoid mutating `data` rows directly; always replace immutably.
- Preserve row-level edit isolation pattern for new editable fields.

### Rendering Rules

- Keep row rendering focused and memo-friendly.
- Avoid expensive computations in render paths.
- Keep heavy transforms in TanStack model pipeline or memoized selectors.

### Validation Rules

- Numeric validation should remain centralized in `src/utils/validation.ts`.
- For new numeric fields, enforce:
  - input guard
  - parse/normalize behavior
  - range constraints

### File Placement Conventions

- table schema and filters: `src/table/`
- state and actions: `src/store/`
- reusable utilities: `src/utils/`
- async data boundary: `src/services/`
- presentational/interactive UI blocks: `src/components/`

## Testing Checklist (Recommended)

- load and render 10,000 rows without lockups
- edit one row and confirm only that row behavior changes
- save/cancel/undo pathways
- numeric validation edge cases
- sorting + filtering combinations
- virtualized and paginated mode parity
- CSV export correctness (filtered vs all, visible columns)
- beforeunload warning with unsaved edits

