import { Droppable } from 'react-beautiful-dnd'
import { Item } from '../../data'
import DraggableItem from '../DraggableItem'
import { List } from './styled'

const ItemList = ({ items }: { items: Item[] }) => (
  <Droppable droppableId="droppable">
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
          />
        ))}
        {provided.placeholder}
      </List>
    )}
  </Droppable>
)

export default ItemList
