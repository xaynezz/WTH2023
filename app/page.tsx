'use client'
import BlindButton from '@/components/ui/blindbutton'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="flex h-1/2 w-full">
        <BlindButton
          text="Describe Scene"
          audioDescription="Describe Scene"
          className="border-black border-4 border-r-0 border-b-0 w-1/2 h-full bg-neutral-400 text-4xl font-semibold text-black hover:bg-slate-600"
          callBack={() => {
            router.push('/imgr')
          }}
        />
        <BlindButton
          text="Describe Object"
          audioDescription="Describe Object"
          className="border-black border-4 w-1/2 border-b-0 h-full bg-neutral-400 text-4xl font-semibold text-black hover:bg-slate-600"
          callBack={() => {
            router.push('ocr')
          }}
        />
      </div>
      <BlindButton
        text="Live Feed"
        audioDescription="Live Feed"
        className="border-black border-4 w-full h-[40%] bg-neutral-200 text-4xl font-semibold text-black hover:bg-slate-600"
        callBack={() => {}}
      />
      <h1 className="text-blue-400 font-semibold text-4xl">My Dog</h1>
    </div>
  )
}
