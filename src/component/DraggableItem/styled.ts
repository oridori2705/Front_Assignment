import styled from '@emotion/styled'
import { GRID } from '../../data'

export const ItemContainer = styled.div<{ isDragging: boolean }>`
  user-select: none;
  padding: ${GRID * 2}px;
  margin: 0 0 ${GRID}px 0;
  background: ${({ isDragging }) => (isDragging ? 'lightgreen' : 'grey')};
`
