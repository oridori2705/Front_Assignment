import styled from '@emotion/styled'

interface MessageWrapperProps {
  isError: boolean
}

export const MessageWrapper = styled.div<MessageWrapperProps>`
  position: fixed;
  bottom: 20px;
  width: 25%;
  margin: 0 auto;
  left: 0;
  right: 0;
  transition: transform 0.2s;
  transform: translateX(-50%);
  transform: ${({ isError }) =>
    isError ? 'translateY(0)' : 'translateY(200%)'};
  z-index: 9999;
`

export const Message = styled.div`
  background-color: #f44336;
  color: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`
