import { useState } from 'react'

import { ColumnMap, getItems } from '../data'

export const useColumnState = () => {
  const [columns, setColumns] = useState<ColumnMap>(() => {
    const savedColumns = localStorage.getItem('columns')
    return savedColumns ? JSON.parse(savedColumns) : getItems(4)
  })
  const [history, setHistory] = useState<ColumnMap[]>([])

  const updateColumns = (newColumns: ColumnMap) => {
    const updatedHistory = [...history, columns]
    if (updatedHistory.length > 5) {
      updatedHistory.shift()
    }
    setHistory(updatedHistory)
    setColumns(newColumns)
    localStorage.setItem('columns', JSON.stringify(newColumns))
  }

  return {
    columns,
    updateColumns,
    history,
    setColumns,
    setHistory
  }
}
