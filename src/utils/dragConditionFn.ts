import { DragUpdate } from 'react-beautiful-dnd'
import { Column } from '../data'

interface UpdateColumnItemsParams {
  sourceIndex: number
  destinationIndex: number
  currentColumnId: string
  columns: Record<string, Column>
}

interface MoveItemBetweenColumnsParams {
  startColumn: Column
  finishColumn: Column
  sourceIndex: number
  destinationIndex: number
  columns: Record<string, Column>
}

const isEven = (id: number) => {
  return id % 2 === 0
}

export const isInvalidDropCondition = (
  { destination, source, draggableId }: DragUpdate,
  columns: Record<string, Column>
): boolean => {
  if (!destination) return false

  if (
    source.droppableId === 'column-1' &&
    destination.droppableId === 'column-3'
  ) {
    return true
  }

  const finishColumn = columns[destination.droppableId]

  if (
    draggableId &&
    isEven(Number(draggableId)) &&
    ((destination.index > 0 &&
      isEven(finishColumn.items[destination.index - 1]?.id)) ||
      isEven(finishColumn.items[destination.index]?.id))
  ) {
    return true
  }

  return false
}

export const updateColumnItems = ({
  sourceIndex,
  destinationIndex,
  currentColumnId,
  columns
}: UpdateColumnItemsParams): Record<string, Column> => {
  const currentColumn = columns[currentColumnId]
  const newItems = Array.from(currentColumn.items)
  const [removed] = newItems.splice(sourceIndex, 1)
  newItems.splice(destinationIndex, 0, removed)

  return {
    ...columns,
    [currentColumnId]: {
      ...currentColumn,
      items: newItems
    }
  }
}

export const moveItemBetweenColumns = ({
  startColumn,
  finishColumn,
  sourceIndex,
  destinationIndex,
  columns
}: MoveItemBetweenColumnsParams): Record<string, Column> => {
  const startItems = Array.from(startColumn.items)
  const finishItems = Array.from(finishColumn.items)
  const [removed] = startItems.splice(sourceIndex, 1)

  finishItems.splice(destinationIndex, 0, removed)

  return {
    ...columns,
    [startColumn.id]: {
      ...startColumn,
      items: startItems
    },
    [finishColumn.id]: {
      ...finishColumn,
      items: finishItems
    }
  }
}
