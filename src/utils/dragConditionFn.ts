import { DragUpdate } from 'react-beautiful-dnd'

import { Column, ColumnMap, Item } from '../data'

interface UpdateColumnItemsParams {
  selectedItemsId: number[]
  destinationIndex: number
  currentColumnId: string
  columns: Record<string, Column>
  startIndex: number
}

interface MoveItemsBetweenColumnsParams {
  startColumn: Column
  finishColumn: Column
  selectedItemIds: number[]
  destinationIndex: number
  columns: Record<string, Column>
}

interface IsEvenListParams {
  draggableId: string
  destinationIndex: number
  finishColumn: Column
  startColumn: Column
  selectedItems: Set<number>
  startIndex: number
}

interface MoveItemsParams {
  destinationIndex: number
  selectedItems: Item[]
  remainingItems: Item[]
  startIndex: number
}

interface IsInvalidDropConditionParams {
  dragUpdate: DragUpdate
  columns: Record<string, Column>
  selectedItems: Set<number>
}

/**
 * 같은 컬럼 내에서 멀티드래그/단일드래그 시 인덱스 계산 후 업데이트 배열을 계산합니다.
 *
 * @param {Object} params
 * @param {number} params.destinationIndex - 아이템을 이동할 목적지 인덱스
 * @param {Item[]} params.selectedItems - 이동할 아이템 목록
 * @param {Item[]} params.remainingItems - 이동 후 남아있는 아이템 목록
 * @param {number} params.startIndex - 드래그가 시작된 인덱스
 * @returns {Item[]} - 업데이트된 아이템 목록
 */
const moveItems = ({
  destinationIndex,
  selectedItems,
  remainingItems,
  startIndex
}: MoveItemsParams): Item[] => {
  const tempArray = remainingItems.slice()
  const offset =
    selectedItems.length > 1 && startIndex < destinationIndex
      ? selectedItems.length - 1
      : 0
  const calculateIndex = destinationIndex - offset

  tempArray.splice(calculateIndex, 0, ...selectedItems)

  return tempArray
}

/**
 * 같은 Draggable 내에서 아이템을 업데이트합니다.
 *
 * @param {Object} params
 * @param {number[]} params.selectedItemsId - 이동할 아이템의 ID 목록
 * @param {number} params.destinationIndex - 아이템을 이동할 목적지 인덱스
 * @param {string} params.currentColumnId - 현재 컬럼 ID
 * @param {Record<string, Column>} params.columns - 모든 컬럼 데이터
 * @param {number} params.startIndex - 드래그가 시작된 인덱스
 * @returns {ColumnMap} - 업데이트된 컬럼 데이터
 */
export const updateColumnItems = ({
  selectedItemsId,
  destinationIndex,
  currentColumnId,
  columns,
  startIndex
}: UpdateColumnItemsParams): ColumnMap => {
  const currentColumn = columns[currentColumnId]
  const currentItems = Array.from(currentColumn.items)

  const selectedItems = prepareItemsForMove(currentItems, selectedItemsId)

  const remainingItems = currentItems.filter(
    item => !selectedItemsId.includes(item.id)
  )

  const updatedItems = moveItems({
    destinationIndex,
    selectedItems,
    remainingItems,
    startIndex
  })

  return {
    ...columns,
    [currentColumnId]: {
      ...currentColumn,
      items: updatedItems
    }
  }
}

/**
 * 다른 Draggable 이동으로 인한 아이템 업데이트를 처리합니다.
 *
 * @param {Object} params
 * @param {Column} params.startColumn - 시작지점 컬럼
 * @param {Column} params.finishColumn - 도착지점 컬럼
 * @param {number[]} params.selectedItemIds - 이동할 아이템의 ID 목록
 * @param {number} params.destinationIndex - 아이템을 이동할 목적지 인덱스
 * @param {Record<string, Column>} params.columns - 모든 컬럼 데이터
 * @returns {ColumnMap} - 업데이트된 컬럼 데이터
 */
export const moveItemBetweenColumns = ({
  startColumn,
  finishColumn,
  selectedItemIds,
  destinationIndex,
  columns
}: MoveItemsBetweenColumnsParams): ColumnMap => {
  const startItems = Array.from(startColumn.items)
  const finishItems = Array.from(finishColumn.items)

  const itemsToMove = prepareItemsForMove(startItems, selectedItemIds)

  const remainingItems = startItems.filter(
    item => !selectedItemIds.includes(item.id)
  )

  finishItems.splice(destinationIndex, 0, ...itemsToMove)

  return {
    ...columns,
    [startColumn.id]: {
      ...startColumn,
      items: remainingItems
    },
    [finishColumn.id]: {
      ...finishColumn,
      items: finishItems
    }
  }
}

/**
 * 1-> 3 컬럼 이동 및 짝수가 연속으로 나열이 되는지 확인합니다.
 *
 *
 * @param {Object} params
 * @param {DragUpdate} params.dragUpdate - onDragUpdate의 인자
 * @param {Record<string, Column>} params.columns - 모든 컬럼 데이터
 * @param {Set<number>} params.selectedItems - 이동할 아이템 목록
 * @returns {string} - 유효하지 않은 이동 조건에 대한 메시지
 */
export const isInvalidDropCondition = ({
  dragUpdate: { destination, source, draggableId },
  columns,
  selectedItems
}: IsInvalidDropConditionParams) => {
  if (!destination) return ''

  const isForbiddenMove =
    source.droppableId === 'column-1' && destination.droppableId === 'column-3'
  if (isForbiddenMove) {
    return '첫 번째 컬럼에서 세 번째 컬럼으로의 이동은 허용되지 않습니다.'
  }

  const startColumn = columns[source.droppableId]
  const finishColumn = columns[destination.droppableId]

  const isEvenSequenceResult = isEvenList({
    draggableId,
    destinationIndex: destination.index,
    startColumn,
    finishColumn,
    selectedItems,
    startIndex: source.index
  })

  return isEvenSequenceResult.length > 0 ? isEvenSequenceResult : ''
}

// 짝수
const isEven = (id: number) => {
  return id % 2 === 0
}

// 짝수 아이템이 연속되는지 확인하는 함수
const checkConsecutiveEvens = (items: number[]) => {
  return items.some((item, index) => isEven(item) && isEven(items[index + 1]))
}

// 아이템 필터링 및 정렬
const prepareItemsForMove = (items: Item[], ids: number[]) => {
  return items.filter(item => ids.includes(item.id)).sort((a, b) => a.id - b.id)
}

/**
 * 선택된 아이템이 짝수로 나열되는지 확인합니다.
 *
 * @param {Object} params
 * @param {number} params.draggableId - 드래그된 아이템의 ID
 * @param {number} params.destinationIndex - 아이템을 이동할 목적지 인덱스
 * @param {Column} params.finishColumn - 도착지점 컬럼
 * @param {Column} params.startColumn - 시작지점 컬럼
 * @param {Set<number>} params.selectedItems - 이동할 아이템 목록
 * @param {number} params.startIndex - 드래그가 시작된 인덱스
 * @returns {string} - 짝수 아이템 나열에 대한 메시지. 조건에 맞지 않으면 빈 문자열을 반환
 */
const isEvenList = ({
  draggableId,
  destinationIndex,
  finishColumn,
  startColumn,
  selectedItems,
  startIndex
}: IsEvenListParams) => {
  const selectedItemsArray = Array.from(selectedItems)
    .map(item => Number(item))
    .sort((a, b) => a - b)

  if (checkConsecutiveEvens(selectedItemsArray)) {
    return '선택한 요소내에 짝수 아이템이 나열됩니다.'
  }

  const remainingItems = Array.from(finishColumn.items).filter(
    item => !selectedItems.has(item.id) && !(item.id === Number(draggableId))
  )

  const startTempItems = startColumn.items.filter(item => {
    const isDraggable = item.id === Number(draggableId)
    const isSelected = selectedItems.has(item.id)
    return !isDraggable && !isSelected
  })

  const draggedItems =
    selectedItemsArray.length > 0
      ? selectedItemsArray.map(id => ({
          id: id,
          content: '',
          isSelected: false
        }))
      : [
          {
            id: Number(draggableId),
            content: '',
            isSelected: false
          }
        ]

  if (startColumn.id === finishColumn.id) {
    const resultArray = moveItems({
      destinationIndex,
      selectedItems: draggedItems,
      remainingItems,
      startIndex
    })

    if (checkConsecutiveEvens(resultArray.map(item => item.id))) {
      return '현재지점에 짝수 아이템끼리 나열됩니다.'
    }
  } else {
    remainingItems.splice(destinationIndex, 0, ...draggedItems)

    if (checkConsecutiveEvens(startTempItems.map(item => item.id))) {
      return '시작지점에 짝수 아이템끼리 나열됩니다.'
    }

    if (checkConsecutiveEvens(remainingItems.map(item => item.id))) {
      return '도착지점에 짝수 아이템끼리 나열됩니다.'
    }
  }

  return ''
}
