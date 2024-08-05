import styled from '@emotion/styled'

import { GRID } from '../../data'

export const ItemContainer = styled.div<{
  isInvalidDrop: boolean
  isDragging: boolean
  isSelected: boolean
  isMultiDragging: boolean
}>`
  user-select: none;
  padding: ${GRID * 2}px;
  margin: 0 0 ${GRID}px 0;

  background: ${({
    isInvalidDrop,
    isDragging,
    isSelected,
    isMultiDragging
  }) => {
    if (isDragging && isInvalidDrop) return '#f44336'
    if (isMultiDragging && isSelected && isDragging) return '#26b126'
    return isSelected ? '#aaecaa' : 'white'
  }};

  color: ${({ isMultiDragging, isSelected, isDragging }) => {
    if (isMultiDragging && isSelected && isDragging) return '#241c1c'
    if (isMultiDragging && isSelected) return '#979494'
    return 'black'
  }};
`
