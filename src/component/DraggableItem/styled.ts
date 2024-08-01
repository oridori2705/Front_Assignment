import styled from '@emotion/styled'
import { GRID } from '../../data'

export const ItemContainer = styled.div<{
  isInvalidDrop: boolean
  isDragging: boolean
}>`
  user-select: none;
  padding: ${GRID * 2}px;
  margin: 0 0 ${GRID}px 0;
  background: ${({ isInvalidDrop, isDragging }) =>
    isInvalidDrop && isDragging ? 'red' : 'white'};
`
