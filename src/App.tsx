import styled from '@emotion/styled'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult
} from 'react-beautiful-dnd'

import ErrorMessage from './component/ErrorMessage'
import ItemList from './component/ItemList'
import { getItems } from './data'
import {
  isInvalidDropCondition,
  moveItemBetweenColumns,
  updateColumnItems
} from './utils/dragConditionFn'

// 멀티 드래그 후 정렬 만들어야 함
// 만약 여러 Droppable에서 선택했을 때는 어떻게 할건지(1컬럼에서 2개 2컬럼에서 1개 -> 4컬럼으로 했을 때)
function App() {
  const [columns, setColumns] = useState(getItems(4))
  const [isInvalidDrop, setIsInvalidDrop] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isMultiDragging, setIsMultiDragging] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set([]))
  const [previousColumnId, setPreviousColumnId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onDragStart = useCallback(
    ({ draggableId }: DragStart) => {
      if (!selectedItems.has(Number(draggableId))) setSelectedItems(new Set())
      setIsInvalidDrop(false)
    },
    [selectedItems]
  )

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result

      if (!isDragging) return
      if (!destination) {
        setIsDragging(false)
        return
      }

      if (isInvalidDrop) {
        setIsInvalidDrop(false)
        setIsDragging(false)
        return
      }

      const startColumn = columns[source.droppableId]
      const finishColumn = columns[destination.droppableId]

      const selectedItemsArray = Array.from(selectedItems)
      const destinationIndex = destination.index

      if (startColumn === finishColumn) {
        setColumns(() =>
          updateColumnItems({
            selectedItemsId:
              selectedItemsArray.length > 0
                ? [...selectedItemsArray]
                : [Number(draggableId)],
            destinationIndex: destinationIndex,
            currentColumnId: startColumn.id,
            columns,
            startIndex: source.index
          })
        )
      } else {
        setColumns(() =>
          moveItemBetweenColumns({
            startColumn,
            finishColumn,
            selectedItemIds:
              selectedItemsArray.length > 0
                ? [...selectedItemsArray]
                : [Number(draggableId)],
            destinationIndex,
            columns
          })
        )
      }
      setSelectedItems(new Set())
      setIsMultiDragging(false)
      setErrorMessage('')
      setIsDragging(false)
    },
    [columns, isDragging, isInvalidDrop, selectedItems]
  )

  const onDragUpdate = useCallback(
    (update: DragUpdate) => {
      setIsDragging(true)
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

  const toggleSelectItem = useCallback(
    (itemId: number, columnId: string) => {
      if (previousColumnId && previousColumnId !== columnId) {
        setSelectedItems(new Set())
      }

      setSelectedItems(prev => {
        const newSelected = new Set(prev)
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId)
        } else {
          newSelected.add(itemId)
        }
        return newSelected
      })

      setPreviousColumnId(columnId)
    },
    [previousColumnId]
  )

  const handleItemClick = useCallback(
    (itemId: number, columnId: string, event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      if (!event.ctrlKey) {
        setIsMultiDragging(false)
        setSelectedItems(new Set([itemId]))
      } else {
        toggleSelectItem(itemId, columnId)
      }
    },
    [toggleSelectItem]
  )

  useEffect(() => {
    const onWindowClick = (e: Event) => {
      if (e.defaultPrevented) {
        return
      }

      setSelectedItems(new Set())
    }

    window.addEventListener('click', onWindowClick)
    return () => {
      window.removeEventListener('click', onWindowClick)
    }
  }, [])

  return (
    <>
      <RootContainer>
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '100px'
            }}>
            {Object.values(columns).map(column => (
              <ItemListWrapper key={column.id}>
                <h3>{column.title}</h3>
                <ItemList
                  droppableId={column.id}
                  items={column.items.map(item => ({
                    ...item,
                    isSelected: selectedItems.has(item.id)
                  }))}
                  isInvalidDrop={isInvalidDrop}
                  isMultiDragging={isMultiDragging}
                  onItemClick={handleItemClick}
                />
              </ItemListWrapper>
            ))}
          </div>
        </DragDropContext>
      </RootContainer>
      <div>{Array.from(selectedItems).join(', ')}</div>

      <ErrorMessage message={errorMessage} />
    </>
  )
}

export default App

const RootContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ItemListWrapper = styled.div`
  border: 2px solid brown;
  overflow: hidden;
  border-radius: 20px;
`
