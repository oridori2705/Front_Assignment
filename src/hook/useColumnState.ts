import { useState } from 'react'

import { ColumnMap, getItems } from '../data'

export const useColumnState = () => {
  const [columns, setColumns] = useState<ColumnMap>(() => {
    const savedColumns = localStorage.getItem('columns')
    return savedColumns ? JSON.parse(savedColumns) : getItems(4)
  })
  const [history, setHistory] = useState<ColumnMap[]>([columns])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)

  const updateColumns = (newColumns: ColumnMap) => {
    const updatedHistory = [
      ...history.slice(0, currentHistoryIndex + 1),
      newColumns
    ]
    if (updatedHistory.length > 5) {
      updatedHistory.shift()
    }
    setHistory(updatedHistory)
    setCurrentHistoryIndex(updatedHistory.length - 1)
    setColumns(newColumns)
    localStorage.setItem('columns', JSON.stringify(newColumns))
  }

  return {
    columns,
    updateColumns,
    history,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    setColumns
  }
}
