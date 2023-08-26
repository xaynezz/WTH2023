'use client'
import { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import axios, { AxiosError } from 'axios'
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}
// @ts-ignore
import { useSpeechRecognition } from 'react-speech-kit'

export default function Live() {
  const commands = [
    'What is written here',
    'describe to me the surrounding',
    'What is in-front of me',
  ]
  const [text, setText] = useState('')
  let images: any[] = []
  const handleSubmitText = async () => {
    const response = await axios.post('/liveaudio', {
      text,
    })

    if (response?.status !== 200) {
      console.error('Failed to send text', response?.data)
    }

    const flag = response?.data?.flag
    if (flag !== -1) {
      const response = await axios.post('/api/liveaudiohandler_v2', {
        images,
      })
      const flag = response?.data?.flag
      if (flag !== -1) {
        const utterance = new SpeechSynthesisUtterance(response?.data?.data)
        speechSynthesis.speak(utterance)
      }
    }
  }

  const { listen } = useSpeechRecognition({
    onResult: (result: any) => {
      setText(result)
      return
    },
  })

  useEffect(() => {
    listen()
  }, [])

  useEffect(() => {
    if (commands.some((command) => command.includes(text))) {
      handleSubmitText()
      setText('')
    }
  }, [text])

  const webcamRef = useRef<Webcam>(null)

  const startSnapshot = () => {
    setInterval(() => {
      const image = webcamRef?.current?.getScreenshot()
      if (!image) return

      if (images.length >= 5) {
        images = [...images.slice(1), image]
      } else {
        return [...images, image]
      }
    }, 5000)
  }

  useEffect(() => {
    startSnapshot()
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
