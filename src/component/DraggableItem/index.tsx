import { MouseEvent } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import { ItemContainer } from './styled'

interface DraggableItemProps {
  item: { id: number; content: string }
  index: number
  isInvalidDrop: boolean
  isSelected: boolean
  columnId: string
  isMultiDragging: boolean
  onItemClick: (
    itemId: number,
    columnId: string,
    event: MouseEvent<HTMLDivElement>
  ) => void
}

const DraggableItem = ({
  item,
  index,
  columnId,
  isInvalidDrop,
  isSelected,
  isMultiDragging,
  onItemClick
}: DraggableItemProps) => (
  <Draggable
    draggableId={item.id.toString()}
    index={index}>
    {(provided, snapshot) => {
      return (
        <ItemContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          isInvalidDrop={isInvalidDrop}
          isSelected={isSelected}
          isMultiDragging={isMultiDragging}
          onClick={event => onItemClick(item.id, columnId, event)}>
          {item.content}
        </ItemContainer>
      )
    }}
  </Draggable>
)

export default DraggableItem
