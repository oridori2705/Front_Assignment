import styled from '@emotion/styled'

import { GRID } from '../../data'

export const List = styled.div<{ isDraggingOver: boolean }>`
  background: ${({ isDraggingOver }) =>
    isDraggingOver ? 'lightblue' : 'lightgrey'};
  padding: ${GRID}px;
  width: 250px;
  height: 700px;
`
