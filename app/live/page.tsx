'use client'
import { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
// @ts-ignore
import { useSpeechRecognition } from 'react-speech-kit'

export default function Live() {
  const commands = [
    'what is written here',
    'describe to me the surrounding',
    'what is in front of me',
  ]
  const [text, setText] = useState('')
  const [images, setImages] = useState<any[]>([])
  const clickCountRef = useRef(0)
  const [facingMode, setFacingMode] = useState<any>(
    process.env.NODE_ENV === 'development' ? 'user' : { exact: 'environment' },
  )
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode,
  }

  const handleButtonClick = () => {
    clickCountRef.current = clickCountRef.current + 1
    setTimeout(() => {
      if (clickCountRef.current === 2) {
        if (facingMode === 'user') setFacingMode({ exact: 'environment' })
        else setFacingMode('user')
      }
      clickCountRef.current = 0
    }, 300)
  }
  const handleSubmitText = async () => {
    const response = await axios.post('/api/liveaudio', {
      data: text,
    })

    if (response?.status !== 200) {
      console.error('Failed to send text', response?.data)
    }

    const flag = response?.data?.flag
    if (flag !== -1) {
      const response = await axios.post('/api/liveaudiohandler_v2', {
        images,
        flag,
      })
      const utterance = new SpeechSynthesisUtterance(response?.data?.data)
      speechSynthesis.speak(utterance)
    }
  }

  const { listen } = useSpeechRecognition({
    onResult: (result: any) => {
      setText(result)
    },
  })

  useEffect(() => {
    console.log(text)
    if (
      commands.some((command) =>
        text.toLowerCase().includes(command.toLowerCase()),
      )
    ) {
      handleSubmitText()
    }
  }, [text])

  const webcamRef = useRef<Webcam>(null)

  const startSnapshot = () => {
    setInterval(() => {
      const image = webcamRef?.current?.getScreenshot()
      if (!image) return

      if (images.length >= 5) {
        const updatedImages = [...images.slice(1), image]
        setImages(updatedImages)
      } else {
        setImages([...images, image])
      }
    }, 1000)
  }

  useEffect(() => {
    startSnapshot()

    setTimeout(() => {
      listen()
    }, 1000)
  }, [])

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onClick={handleButtonClick}
      />
    </div>
  )
}
