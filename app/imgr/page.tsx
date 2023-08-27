'use client'
import Webcam from 'react-webcam'
import React, { useState, useRef, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode:
    process.env.NODE_ENV === 'development' ? 'user' : { exact: 'environment' },
}

export default function OCR() {
  const speakRef = useRef('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const webcamRef = useRef<Webcam>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('')
  const capture = React.useCallback(async () => {
    setIsLoading(true)
    const image = webcamRef?.current?.getScreenshot()
    try {
      const response = await axios.post('/api/imgr', {
        image,
      })
      speakRef.current = response.data?.data
      buttonRef.current?.click()
      // const utterance = new SpeechSynthesisUtterance(response.data?.data)
      // speechSynthesis.speak(utterance)
      setText(response.data?.data)
    } catch (e) {
      if (e instanceof AxiosError) {
        speakRef.current = 'Something went wrong. Please try again.'
        buttonRef.current?.click()
        // const utterance = new SpeechSynthesisUtterance(
        //   'Something went wrong. Please try again.',
        // )
        // speechSynthesis.speak(utterance)
        console.error(e)
      }
    }
    setIsLoading(false)
  }, [webcamRef])

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(speakRef.current)
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
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
      <button className="invisible" onClick={speak} ref={buttonRef}></button>
      {'text ' + text}
    </div>
  )
}
