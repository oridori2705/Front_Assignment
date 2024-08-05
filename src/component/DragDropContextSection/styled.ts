import styled from '@emotion/styled'

interface BadgeProps {
  isExceeded: number
}
export const RootContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ItemListWrapper = styled.div`
  border: 2px solid brown;
  overflow: hidden;
  border-radius: 20px;
`

export const Button = styled.button`
  position: relative;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

export const Badge = styled.span<BadgeProps>`
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: ${props =>
    props.isExceeded === 5 ? 'red' : props.isExceeded === 0 ? 'gray' : 'green'};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`
