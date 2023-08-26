import { NextResponse } from 'next/server'
export async function POST(request: Request) {
  const { image } = await request.json()
  console.log(image)
  return NextResponse.json({ message: 'Called successfully', success: true })
}
