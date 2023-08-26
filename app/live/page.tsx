'use client'
import { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
// @ts-ignore
import { useSpeechRecognition } from 'react-speech-kit'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode:
    process.env.NODE_ENV === 'development' ? 'user' : { exact: 'environment' },
}

export default function Live() {
  const commands = [
    'what is written here',
    'describe to me the surrounding',
    'what is in front of me',
  ]
  const [text, setText] = useState('')
  const [images, setImages] = useState<any[]>([])
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
      />
    </div>
  )
}
