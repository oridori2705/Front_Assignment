import { useState, useCallback } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Item, getItems, reorder } from './data'

import ItemList from './component/ItemList'

function App() {
  const [items, setItems] = useState<Item[]>(getItems(10))

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return
      }

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index
      )

      setItems(newItems)
    },
    [items]
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ItemList items={items} />
    </DragDropContext>
  )
}

export default App
