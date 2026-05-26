import { useEffect } from 'react'

import { DataTable } from '../components/table/DataTable'
import { TOTAL_MOCK_ROWS } from '../constants/table'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import { fetchMockEmployees } from '../services/mockDataService'
import { countUnsavedEdits, useTableStore } from '../store/tableStore'

export const DataTablePage = () => {
  const loading = useTableStore((state) => state.loading)
  const loadData = useTableStore((state) => state.loadData)
  const setLoading = useTableStore((state) => state.setLoading)
  const unsavedEdits = useTableStore(countUnsavedEdits)

  useUnsavedChangesGuard(unsavedEdits > 0)

  useEffect(() => {
    let isMounted = true

    const loadInitialRows = async (): Promise<void> => {
      setLoading(true)
      const rows = await fetchMockEmployees(TOTAL_MOCK_ROWS)
      if (isMounted) {
        loadData(rows)
      }
    }

    void loadInitialRows()

    return () => {
      isMounted = false
    }
  }, [loadData, setLoading])

  if (loading) {
    return (
      <main className="loading-state">
        <h1>Preparing data table...</h1>
        <p>Generating and indexing {TOTAL_MOCK_ROWS.toLocaleString()} mock rows.</p>
      </main>
    )
  }

  return (
    <main>
      <DataTable />
    </main>
  )
}
