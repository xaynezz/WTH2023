'use client'
import Webcam from 'react-webcam'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export default function OCR() {
  const webcamRef = useRef<Webcam>(null)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (announcement) {
      const utterance = new SpeechSynthesisUtterance(announcement)
      speechSynthesis.speak(utterance)
    }
  }, [announcement])

  const capture = React.useCallback(async () => {
    const image = webcamRef?.current?.getScreenshot()
    try {
      const response = await axios.post('/api/imgr', {
        image,
      })
      setAnnouncement(response?.data?.short_description)
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e)
      }
    }
  }, [webcamRef])
  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onClick={capture}
      />
    </div>
  )
}
