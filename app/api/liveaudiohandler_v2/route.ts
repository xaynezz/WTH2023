import axios from 'axios'
import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// Convert the Base64 image to a Blob
function base64ToBlob(base64Data: any, contentType: any) {
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
  const { images, flag } = await request.json()

  const arrayOfsubString = [
    'What is written here',
    'describe to me the surrounding',
    'What is in-front of me',
  ]

  const prompt = arrayOfsubString[flag]
  var finalString = ''
  for (let i = 0; i <= images.length; i++) {
    const image = images[i]
    try {
      const strippedHeader = image.split(',')[1]

      var blob = base64ToBlob(strippedHeader, 'image/jpeg')

      const inference = new HfInference(process.env.HF_TOKEN)

      const response = await inference.imageToText({
        data: blob,
        // model: 'Salesforce/blip-image-captioning-base',
        model: 'nlpconnect/vit-gpt2-image-captioning',
      })

      console.log(response)
      finalString += response.generated_text + '\n'
    } catch (error) {
      console.log(error)
    }
  }
  return NextResponse.json({ hello: finalString })
}
