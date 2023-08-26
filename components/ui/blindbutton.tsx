import { useState } from 'react'
import { Button } from './button'

interface BlindButtonProps {
  text: string
  audioDescription: string
  className: string
  callBack: () => void
}

export default function BlindButton(props: BlindButtonProps) {
  const [clickCount, setClickCount] = useState(0)

  const handleButtonClick = () => {
    setClickCount((prevCount) => prevCount + 1)
    setTimeout(() => {
      if (clickCount === 0) {
        props.callBack()
        console.log('Single click')
      } else if (clickCount === 1) {
        const announcement = new SpeechSynthesisUtterance(
          props.audioDescription,
        )
        window.speechSynthesis.speak(announcement)
        console.log('Double click')
      }
      setClickCount(0)
    }, 300)
  }

  return (
    <Button onClick={handleButtonClick} size="lg" className={props.className}>
      {props.text}
    </Button>
  )
}
