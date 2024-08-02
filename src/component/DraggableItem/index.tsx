import { Draggable } from 'react-beautiful-dnd'
import { ItemContainer } from './styled'

interface DraggableItemProps {
  item: { id: number; content: string }
  index: number
  isInvalidDrop: boolean
}

const DraggableItem = ({ item, index, isInvalidDrop }: DraggableItemProps) => (
  <Draggable
    draggableId={item.id.toString()}
    index={index}>
    {(provided, snapshot) => (
      <ItemContainer
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        isDragging={snapshot.isDragging}
        isInvalidDrop={isInvalidDrop}>
        {item.content}
      </ItemContainer>
    )}
  </Draggable>
)

export default DraggableItem
