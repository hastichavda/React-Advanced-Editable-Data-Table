# Advanced Editable Data Table

Production-oriented React implementation of an editable data table designed for large datasets (10,000+ rows), with row-level edit isolation, virtualized rendering, scalable sorting/filtering, pagination fallback, CSV export, and unsaved-changes protection.

## Setup

```bash
npm install
npm run dev
```

Build and validation:

```bash
npm run lint
npm run build
```

## Tech Stack

- React 19 + TypeScript + Vite
- TanStack Table (`@tanstack/react-table`)
- `react-window` (virtual scrolling)
- Zustand (lightweight store for table and edit state)
- Custom CSS (clean, dependency-light UI)

## Architecture

Top-level structure:

```text
src/
  components/
    table/
    filters/
    pagination/
    editable-cell/
  hooks/
  store/
  table/
  services/
  utils/
  types/
  constants/
  pages/
```

Key responsibilities:

- `store/tableStore.ts`: central state for data, edits, filters, sorting, pagination, column visibility, undo history.
- `table/columns.ts`: centralized column configuration and metadata.
- `table/filterFns.ts`: reusable scalable filter functions.
- `services/mockDataService.ts`: realistic mock data generation and async load simulation.
- `components/*`: UI split by concern (toolbar, filters, rows, cells, pagination).

## State Management Design

Zustand store is intentionally focused and lightweight:

- **Data state**: `data`, `rowIndexById`
- **Table UI state**: `sorting`, `columnFilters`, `globalFilter`, `pagination`, `usePagination`, `columnVisibility`
- **Editing state**: per-row `editingRows` with `original`, `draft`, `dirty`, `validationErrors`
- **Undo state**: `undoHistory` for saved row rollback

Why this shape:

- Row draft updates do not mutate the primary dataset.
- Keystrokes only update the edited row draft entry.
- Save commits one immutable row replacement instead of rebuilding all rows.

## Performance Optimizations

- Virtualized mode uses `react-window` `List` for large row counts.
- Pagination fallback mode provides non-virtual rendering for smaller paged slices.
- Row edit isolation in store prevents full table data churn while typing.
- Stable row IDs and row-level memoized components reduce unnecessary work.
- Debounced global search avoids expensive filtering on every keypress.
- Filtering resets page index but preserves filter/sort state across pagination.

## Editing Workflow

Each row supports:

- `Edit`: enters isolated draft mode for that row
- `Save`: validates numeric fields and commits row atomically
- `Cancel`: discards draft and exits edit mode
- `Undo`: reverts current draft (while editing) or last saved change (after save)

Validation highlights numeric errors inline (`salary`, `quantity`, `experience`) before allowing save.

## Filtering and Sorting

- Multi-column sorting via TanStack (`Shift + Click` on headers)
- Global search across major columns
- Column-level filters:
  - Text: `name`, `email`, `department`
  - Numeric ranges: `salary`, `quantity`, `experience`
- Clear filters action resets global + column filters

## Virtualization Approach

- In virtual mode, the table renders sorted/filtered rows via `react-window` list.
- Header remains outside the virtualized viewport for a stable UX.
- Horizontal overflow is supported through a scroll container and fixed column widths.
- Overscan is enabled for smoother fast scrolling.

## CSV Export

- **Export filtered CSV**: exports current filtered (and sorted) row set.
- **Export all CSV**: exports raw dataset.
- Both exports preserve currently visible columns (except actions).

## Unsaved Changes Protection

- Unsaved row drafts are tracked in the store.
- A `beforeunload` guard prompts users when leaving with unsaved edits.
- Behavior covers refresh, close-tab, and navigation away from the page.

## Tradeoffs

- Fixed row height is used for virtualization simplicity and scroll performance.
- Numeric drafts are stored as strings while editing, then parsed on save.
- Undo history is currently one-level per row (last saved state).
- Mock service is local; backend persistence is intentionally abstracted for future integration.

## Known Limitations

- No server-side paging/sorting/filtering yet (client-side only).
- Keyboard shortcuts are lightweight (Enter/Escape in editable cells), not full spreadsheet navigation.
- Department filter uses text includes behavior instead of strict enum matching.

## Scalability Considerations

- Store/API boundaries are ready for backend integration:
  - swap `mockDataService` with API calls
  - keep row editing and validation behavior unchanged
- Large data transforms remain in TanStack row models, not inline in render.
- Column config is centralized, supporting future schema-driven table extension.

## Additional Documentation

- `docs/REFERRAL_TECHNICAL_DOCUMENTATION.md` - formal acceptance-mapped implementation writeup
- `docs/FUNCTIONALITY_GUIDELINES.md` - functional walkthrough and maintenance guidelines
- `docs/ROADMAP_TODO.md` - phased module-wise to-do roadmap for continued delivery
