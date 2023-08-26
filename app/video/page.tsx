'use client'
import { useRef, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io('http://localhost:3001')
    setSocket(socketInstance)

    socketInstance.on('serverResponse', (data: any) => {
      console.log('Received response from server:', data)
      // Handle the received data as needed
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current!.srcObject = stream
          videoRef.current!.play()

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')

          const captureFrame = () => {
            context!.drawImage(
              videoRef.current!,
              0,
              0,
              canvas.width,
              canvas.height,
            )
            const frame = canvas.toDataURL('image/jpeg')
            socket.emit('videoFrame', frame)
          }

          const interval = setInterval(captureFrame, 100)
          return () => clearInterval(interval)
        })
        .catch((err) => {
          console.error('Error accessing the camera', err)
        })
    }
  }, [socket])
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <video ref={videoRef} width="400" height="300" muted></video>
    </div>
  )
}
