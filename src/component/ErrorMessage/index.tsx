import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Message, MessageWrapper } from './styled'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const [isAnimation, setIsAnimation] = useState(false)
  const refTimer = useRef<number | null>(null)
  useEffect(() => {
    if (refTimer.current) return
    if (message.length > 0) {
      setIsAnimation(true)
      refTimer.current = window.setTimeout(() => {
        setIsAnimation(false)
      }, 5000)
    }

    return () => {
      if (refTimer.current) {
        setIsAnimation(false)
        clearTimeout(refTimer.current)
        refTimer.current = null
      }
    }
  }, [message])

  return createPortal(
    <MessageWrapper isError={isAnimation}>
      <Message>{message}</Message>
    </MessageWrapper>,
    document.body
  )
}
export default ErrorMessage
