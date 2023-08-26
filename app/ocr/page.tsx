'use client'
import Webcam from 'react-webcam'
import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode:
    process.env.NODE_ENV === 'development' ? 'user' : { exact: 'environment' },
}

export default function OCR() {
  const webcamRef = useRef<Webcam>(null)
  const [isLoading, setIsLoading] = useState(false)

  const capture = React.useCallback(async () => {
    setIsLoading(true)
    const image = webcamRef?.current?.getScreenshot()
    try {
      const response = await axios.post('/api/ocr', {
        image,
      })
      const utterance = new SpeechSynthesisUtterance(response.data?.data)
      speechSynthesis.speak(utterance)
    } catch (e) {
      if (e instanceof AxiosError) {
        const utterance = new SpeechSynthesisUtterance(
          'Something went wrong. Please try again.',
        )
        speechSynthesis.speak(utterance)
        console.error(e)
      }
    }
    setIsLoading(false)
  }, [webcamRef])
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      {isLoading ? (
        <Image src={'/Loading.svg'} alt="Loading..." width={100} height={100} />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onClick={capture}
        />
      )}
    </div>
  )
}
