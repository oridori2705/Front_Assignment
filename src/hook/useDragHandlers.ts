import { useCallback, useState } from 'react'
import { DragStart, DragUpdate, DropResult } from 'react-beautiful-dnd'

import { ColumnMap } from '../data'
import {
  isInvalidDropCondition,
  moveItemBetweenColumns,
  updateColumnItems
} from '../utils/dragConditionFn'

interface UseDragHandlersProps {
  columns: ColumnMap
  selectedItems: Set<number>
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<number>>>
  updateColumns: (newColumns: ColumnMap) => void
}

export const useDragHandlers = ({
  columns,
  selectedItems,
  setSelectedItems,
  updateColumns
}: UseDragHandlersProps) => {
  const [isInvalidDrop, setIsInvalidDrop] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isMultiDragging, setIsMultiDragging] = useState(false)

  const onDragStart = useCallback(
    ({ draggableId }: DragStart) => {
      if (!selectedItems.has(Number(draggableId))) setSelectedItems(new Set())
      setIsInvalidDrop(false)
    },
    [selectedItems, setSelectedItems]
  )

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result

      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return
      }

      if (isInvalidDrop) {
        setIsInvalidDrop(false)
        return
      }

      const startColumn = columns[source.droppableId]
      const finishColumn = columns[destination.droppableId]
      const selectedItemsArray = Array.from(selectedItems)
      const destinationIndex = destination.index

      let newColumns

      if (startColumn === finishColumn) {
        newColumns = updateColumnItems({
          selectedItemsId:
            selectedItemsArray.length > 0
              ? [...selectedItemsArray]
              : [Number(draggableId)],
          destinationIndex,
          startColumnId: startColumn.id,
          columns,
          startIndex: source.index
        })
      } else {
        newColumns = moveItemBetweenColumns({
          startColumn,
          finishColumn,
          selectedItemIds:
            selectedItemsArray.length > 0
              ? [...selectedItemsArray]
              : [Number(draggableId)],
          destinationIndex,
          columns
        })
      }

      updateColumns(newColumns)
      setSelectedItems(new Set())
      setIsMultiDragging(false)
      setErrorMessage('')
    },
    [columns, isInvalidDrop, selectedItems, updateColumns, setSelectedItems]
  )

  const onDragUpdate = useCallback(
    (update: DragUpdate) => {
      if (selectedItems.size > 0) setIsMultiDragging(true)
      const validationResult = isInvalidDropCondition({
        dragUpdate: update,
        columns,
        selectedItems
      })

      if (validationResult) {
        setIsInvalidDrop(true)
        setErrorMessage(validationResult)
      } else {
        setIsInvalidDrop(false)
        setErrorMessage('')
      }
    },
    [columns, selectedItems]
  )

  return {
    onDragStart,
    onDragEnd,
    onDragUpdate,
    isInvalidDrop,
    errorMessage,
    isMultiDragging,
    setIsMultiDragging
  }
}
