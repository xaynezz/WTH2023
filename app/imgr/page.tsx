'use client'
import Webcam from 'react-webcam'
import React, { useState, useRef, useEffect } from 'react'
import axios, { AxiosError } from 'axios'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode:
    process.env.NODE_ENV === 'development' ? 'user' : { exact: 'environment' },
}

export default function OCR() {
  const webcamRef = useRef<Webcam>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (announcement) {
      const utterance = new SpeechSynthesisUtterance(announcement)
      speechSynthesis.speak(utterance)
    }
  }, [announcement])

  const capture = React.useCallback(async () => {
    setIsLoading(true)
    const image = webcamRef?.current?.getScreenshot()
    try {
      const response = await axios.post('/api/imgr', {
        image,
      })
      setAnnouncement(response?.data?.short_description)
    } catch (e) {
      if (e instanceof AxiosError) {
        setAnnouncement('Picture was not clear, please try again')
        console.error(e)
      }
    }
    setIsLoading(false)
  }, [webcamRef])
  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      {isLoading ? (
        <div>Loading...</div>
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
