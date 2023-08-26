import { NextResponse } from 'next/server'
export async function POST(request: Request) {
  const response = await request.json()
  console.log(response)
  return NextResponse.json({ message: 'Called successfully', success: true })
}
