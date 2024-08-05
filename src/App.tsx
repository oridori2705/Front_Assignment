import styled from '@emotion/styled'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import ErrorMessage from './component/ErrorMessage'
import ItemList from './component/ItemList'
import { getItems } from './data'

import DragDropDescription from './component/DragDescription'
import { useColumnState } from './hook/useColumnState'
import { useDragHandlers } from './hook/useDragHandlers'

function App() {
  const {
    columns,
    updateColumns,
    currentHistoryIndex,
    history,
    setCurrentHistoryIndex,
    setColumns
  } = useColumnState()
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
    [toggleSelectItem]
  )

  const handleUndo = useCallback(() => {
    if (currentHistoryIndex === 0) return

    const newHistoryIndex = currentHistoryIndex - 1
    setCurrentHistoryIndex(newHistoryIndex)
    setColumns(history[newHistoryIndex])
  }, [currentHistoryIndex, history])

  const handleReset = () => {
    const resetColumns = getItems(4)
    setColumns(resetColumns)
    localStorage.setItem('columns', JSON.stringify(resetColumns))
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
          disabled={currentHistoryIndex === 0}>
          되돌리기
        </Button>

        <Button onClick={handleReset}>초기화하기</Button>
      </ButtonContainer>
      <ErrorMessage message={errorMessage} />
      <DragDropDescription />
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
const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`
