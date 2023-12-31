import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// Convert the Base64 image to a Blob
function base64ToBlob(base64Data: any, contentType: any) {
  contentType = contentType || ''
  var sliceSize = 1024
  var byteCharacters = atob(base64Data)
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

export async function POST(request: Request) {
  const { image } = await request.json()
  const strippedHeader = image.split(',')[1]
  var blob = base64ToBlob(strippedHeader, 'image/jpeg')

  const inference = new HfInference(process.env.HF_TOKEN)
  const response = await inference.imageToText({
    data: blob,
    model: 'nlpconnect/vit-gpt2-image-captioning',
  })

  return NextResponse.json({ data: response.generated_text })
}
