'use client'
import Webcam from 'react-webcam'
import React from 'react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export default function OCR() {
  const webcamRef = useRef<Webcam>(null)
  const capture = React.useCallback(async () => {
    const image = webcamRef?.current?.getScreenshot()
    try {
      const response = await axios.post('/dummyapi/ocr', {
        image,
      })
      console.log(response)
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e)
      }
    }
  }, [webcamRef])
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <Webcam
        ref={webcamRef}
        audio={false}
        height={500}
        screenshotFormat="image/jpeg"
        width={1000}
        videoConstraints={videoConstraints}
      />
      <Button onClick={capture} variant="outline">
        Capture photo
      </Button>
    </div>
  )
}
