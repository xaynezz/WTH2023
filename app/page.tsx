'use client'
import BlindButton from '@/components/ui/blindbutton'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="flex h-1/2 w-full">
        <BlindButton
          text="Describe Scene"
          audioDescription="Describe Scene"
          className="rounded-none border-black border-4 border-r-0 border-b-0 w-1/2 h-full bg-neutral-400 text-4xl font-semibold text-black hover:bg-slate-300"
          callBack={() => {
            router.push('/imgr')
          }}
        />
        <BlindButton
          text="Read Text"
          audioDescription="Read Text"
          className="rounded-none border-black border-4 w-1/2 border-b-0 h-full bg-slate-400 text-4xl font-semibold text-black hover:bg-slate-300"
          callBack={() => {
            router.push('/ocr')
          }}
        />
      </div>
      <BlindButton
        text="Live Feed"
        audioDescription="Live Feed"
        className="rounded-none border-black border-4 w-full h-[40%] bg-neutral-200 text-5xl font-semibold text-black hover:bg-slate-300"
        callBack={() => {
          router.push('/live')
        }}
      />
      <h1 className="bg-black w-full h-[10%] flex justify-center items-center">
        <Image
          src={'/Visual.png'}
          width={100}
          height={100}
          alt="VisuAI"
          className="scale-110"
        />
      </h1>
    </div>
  )
}
