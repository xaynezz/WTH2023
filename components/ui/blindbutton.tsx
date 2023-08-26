import { useRef, useState } from 'react'
import { Button } from './button'

interface BlindButtonProps {
  text: string
  audioDescription: string
  className: string
  callBack: () => void
}

export default function BlindButton(props: BlindButtonProps) {
  const clickCountRef = useRef(0)

  const handleButtonClick = () => {
    clickCountRef.current = clickCountRef.current + 1
    setTimeout(() => {
      if (clickCountRef.current === 1) {
        props.callBack()
        console.log('Single click')
      } else if (clickCountRef.current === 2) {
        const announcement = new SpeechSynthesisUtterance(
          props.audioDescription,
        )
        window.speechSynthesis.speak(announcement)
        console.log('Double click')
      }
      clickCountRef.current = 0
    }, 300)
  }

  return (
    <Button onClick={handleButtonClick} size="lg" className={props.className}>
      {props.text}
    </Button>
  )
}
