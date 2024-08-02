import { DragUpdate } from 'react-beautiful-dnd'
import { Column, Item } from '../data'

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

interface canDropItemWithoutCreatingEvenSequenceParams {
  draggableId: string
  destinationIndex: number
  finishColumn: Column
}

//1->3 이동 불가 조건 및 짝수 나열 조건 처리
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
    canDropItemWithoutCreatingEvenSequence({
      draggableId,
      destinationIndex: destination.index,
      finishColumn
    })
  ) {
    return true
  }

  return false
}

// 같은 Draggable내에서 업데이트
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

//다른 Draggable 이동으로 인한 업데이트
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

// 짝수
const isEven = (id: number) => {
  return id % 2 === 0
}

// 짝수 나열 체크 함수
const canDropItemWithoutCreatingEvenSequence = ({
  draggableId,
  destinationIndex,
  finishColumn
}: canDropItemWithoutCreatingEvenSequenceParams) => {
  const tempItems = finishColumn.items.filter(
    item => item.id.toString() !== draggableId
  )
  const draggedItem: Item = { id: Number(draggableId), content: '' }

  tempItems.splice(destinationIndex, 0, draggedItem)

  for (let i = 0; i < tempItems.length - 1; i++) {
    if (isEven(tempItems[i].id) && isEven(tempItems[i + 1].id)) {
      return true
    }
  }

  return false
}
