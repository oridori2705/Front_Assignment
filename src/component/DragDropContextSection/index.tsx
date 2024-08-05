import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import { getItems } from '../../data'
import { useColumnState } from '../../hook/useColumnState'
import { useDragHandlers } from '../../hook/useDragHandlers'
import ErrorMessage from '../ErrorMessage'
import ItemList from '../ItemList'
import {
  Badge,
  Button,
  ButtonContainer,
  ItemListWrapper,
  RootContainer
} from './styled'

export const DragDropContextSection = () => {
  const { columns, updateColumns, history, setColumns, setHistory } =
    useColumnState()
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set([]))
  const [previousColumnId, setPreviousColumnId] = useState<string | null>(null)

  const {
    onDragStart,
    onDragEnd,
    onDragUpdate,
    isInvalidDrop,
    errorMessage,
    isMultiDragging,
    setIsMultiDragging
  } = useDragHandlers({
    columns,
    selectedItems,
    setSelectedItems,
    updateColumns
  })

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
    [toggleSelectItem, setIsMultiDragging]
  )

  const handleUndo = () => {
    if (history.length === 0) return

    const beforeColumn = history.at(-1)

    if (beforeColumn !== undefined) {
      setColumns(beforeColumn)
      setHistory(prev => prev.slice(0, -1))
      localStorage.setItem('columns', JSON.stringify(beforeColumn))
    }
  }

  const handleReset = () => {
    const resetColumns = getItems(4)

    updateColumns(resetColumns)
  }

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
      <ButtonContainer>
        <Button
          onClick={handleUndo}
          disabled={history.length <= 0}>
          되돌리기
          <Badge isExceeded={history.length}>{history.length}</Badge>
        </Button>

        <Button onClick={handleReset}>초기화하기</Button>
      </ButtonContainer>
      <span>{history.length}</span>
      <ErrorMessage message={errorMessage} />
    </>
  )
}
