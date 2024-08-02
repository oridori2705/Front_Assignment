import { useState } from 'react'
import { DragDropContext, DragUpdate, DropResult } from 'react-beautiful-dnd'
import { getItems } from './data'

import ItemList from './component/ItemList'
import {
  isInvalidDropCondition,
  moveItemBetweenColumns,
  updateColumnItems
} from './utils/dragConditionFn'

function App() {
  const [columns, setColumns] = useState(getItems(4))
  const [isInvalidDrop, setIsInvalidDrop] = useState(false)

  const onDragStart = () => {
    setIsInvalidDrop(false)
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) return
    if (isInvalidDrop) {
      setIsInvalidDrop(false)
      return
    }

    const startColumn = columns[source.droppableId]
    const finishColumn = columns[destination.droppableId]

    if (startColumn === finishColumn) {
      setColumns(() =>
        updateColumnItems({
          sourceIndex: source.index,
          destinationIndex: destination.index,
          columns,
          currentColumnId: startColumn.id
        })
      )
    } else {
      setColumns(() =>
        moveItemBetweenColumns({
          startColumn,
          finishColumn,
          sourceIndex: source.index,
          destinationIndex: destination.index,
          columns
        })
      )
    }
  }

  const onDragUpdate = (update: DragUpdate) => {
    setIsInvalidDrop(isInvalidDropCondition(update, columns))
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.values(columns).map(column => (
          <ItemList
            key={column.id}
            droppableId={column.id}
            items={column.items}
            isInvalidDrop={isInvalidDrop}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

export default App
