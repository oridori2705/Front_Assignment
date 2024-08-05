import { MouseEvent } from 'react'
import { Droppable } from 'react-beautiful-dnd'

import { Item } from '../../data'
import DraggableItem from '../DraggableItem'
import { List } from './styled'

interface ItemListProps {
  items: Item[]
  droppableId: string
  isInvalidDrop: boolean
  isMultiDragging: boolean
  onItemClick: (
    itemId: number,
    columnId: string,
    event: MouseEvent<HTMLDivElement>
  ) => void
}

const ItemList = ({
  items,
  droppableId,
  isInvalidDrop,
  isMultiDragging,
  onItemClick
}: ItemListProps) => (
  <>
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <List
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}>
          {items.map((item, index) => (
            <DraggableItem
              key={item.id}
              item={item}
              index={index}
              isInvalidDrop={isInvalidDrop}
              onItemClick={onItemClick}
              isMultiDragging={isMultiDragging}
              isSelected={item.isSelected}
              columnId={droppableId}
            />
          ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </>
)

export default ItemList
