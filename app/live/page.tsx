'use client'
import { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import axios, { AxiosError } from 'axios'
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export default function Live() {
  const [images, setImages] = useState<string[]>([])
  const [announcement, setAnnouncement] = useState<string>('')
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const reader = new FileReader()
            reader.readAsDataURL(event.data)
            reader.onloadend = async () => {
              const base64Audio = reader.result as string

              try {
                const response = await axios.post('/dummyapi/live', {
                  audio: base64Audio,
                })

                if (response.status !== 200) {
                  console.error('Failed to send audio', response.data)
                }
                // handle gracefully
                const flag = response?.data?.flag
                if (flag) {
                  const resp = await axios.post('/api/live', {
                    images,
                    flag,
                  })

                  if (resp.status !== 200) {
                    console.error('Failed to send images', resp.data)
                  }

                  setAnnouncement(resp?.data?.data)
                }
              } catch (err) {
                console.error('Error sending audio data:', err)
              }
            }
          }
        }

        mediaRecorder.start(100) // Capture audio chunks every 100ms
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop())
        }
      })
      .catch((err) => {
        console.error('Error accessing the microphone', err)
      })
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
  }

  const startSnapshot = () => {
    setInterval(() => {
      const image = webcamRef?.current?.getScreenshot()
      setImages((prevImages) => {
        if (prevImages.length >= 5) {
          const updatedImages = [...prevImages.slice(1), image]
          return updatedImages
        } else {
          return [...prevImages, image]
        }
      })
    }, 5000)
  }

  useEffect(() => {
    if (announcement) {
      const utterance = new SpeechSynthesisUtterance(announcement)
      speechSynthesis.speak(utterance)
    }
  }, [announcement])

  useEffect(() => {
    startRecording()
    startSnapshot()
    return () => stopRecording()
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
