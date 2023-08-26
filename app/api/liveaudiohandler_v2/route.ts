import axios from 'axios'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { HfInference } from '@huggingface/inference'
import { removeNewlines } from '@/lib/string'
const { ocrSpace } = require('ocr-space-api-wrapper')

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
  const { images, flag } = await request.json()

  switch (flag) {
    case 0:
      console.log('flag 0 -> What is written here')
      try {
        const image = images[0]
        const res1 = await ocrSpace(image, { apiKey: process.env.OCR_KEY })
        const processedDataWithoutSlashN = removeNewlines(
          res1.ParsedResults[0].ParsedText,
        )
        return NextResponse.json({
          data: processedDataWithoutSlashN,
        })
      } catch (error) {
        console.error('Error making POST request:', error)
        throw error // or handle the error as you see fit
      }
    case 1:
      console.log('flag 1 -> describe to me the surroundin')
      var stringAboutEnvironment = ''
      for (let i = 0; i < images.length; i++) {
        // Fixed loop condition
        const image = images[i]
        try {
          const strippedHeader = image.split(',')[1]
          var blob = base64ToBlob(strippedHeader, 'image/jpeg')

          const inference = new HfInference(process.env.HF_TOKEN)
          const response = await inference.imageToText({
            data: blob,
            model: 'nlpconnect/vit-gpt2-image-captioning',
          })
          stringAboutEnvironment += response.generated_text
        } catch (error) {
          console.error('Error making POST request:', error)
          throw error // or handle the error as you see fit
        }
      }

      try {
        const openai = new OpenAI({
          apiKey: process.env.GPT_KEY,
        })

        const aggregatedString =
          'With this environment, ' +
          stringAboutEnvironment +
          ' can you describe to a visually impaired person about the surrounding and summarize it with a maximum of 40 words?. Only warn if it is a danger environment'
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: aggregatedString }],
          model: 'gpt-3.5-turbo',
        })

        return NextResponse.json({
          data: chatCompletion.choices[0].message.content,
        })
      } catch (error) {
        console.error('Error calling OpenAI API:', error)
        return NextResponse.json({ error: 'Error processing chat request.' })
      }

    case 2:
    default:
      return NextResponse.json({ error: 'Invalid flag value.' })
  }
}
