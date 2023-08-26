import { removeNewlines } from '@/lib/string'
import { NextResponse } from 'next/server'
const { ocrSpace } = require('ocr-space-api-wrapper')

export async function POST(request: Request) {
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    const { image } = await request.json()
    const res1 = await ocrSpace(image, { apiKey: process.env.OCR_KEY })
    const processedDataWithoutSlashN = removeNewlines(res1.ParsedResults[0].ParsedText)
    return NextResponse.json({ data: processedDataWithoutSlashN })
  } catch (error) {
    console.error(error)
  }
}
