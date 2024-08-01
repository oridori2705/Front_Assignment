import { Draggable } from 'react-beautiful-dnd'
import { Item } from '../../data'
import { ItemContainer } from './styled'

const DraggableItem = ({ item, index }: { item: Item; index: number }) => (
  <Draggable
    key={item.id}
    draggableId={item.id}
    index={index}>
    {(provided, snapshot) => (
      <ItemContainer
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        isDragging={snapshot.isDragging}>
        {item.content}
      </ItemContainer>
    )}
  </Draggable>
)

export default DraggableItem
