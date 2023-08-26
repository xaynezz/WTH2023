'use client'
import { useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import axios, { AxiosError } from 'axios'
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export default function Live() {
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

  useEffect(() => {
    startRecording()
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
