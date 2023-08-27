'use client'
import Webcam from 'react-webcam'
import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'

export default function OCR() {
  const webcamRef = useRef<Webcam>(null)
  const [isLoading, setIsLoading] = useState(false)
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
      if (clickCountRef.current === 1) {
        capture()
      } else if (clickCountRef.current === 2) {
        if (facingMode === 'user') setFacingMode({ exact: 'environment' })
        else setFacingMode('user')
      }
      clickCountRef.current = 0
    }, 300)
  }

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
          onClick={handleButtonClick}
        />
      )}
    </div>
  )
}
