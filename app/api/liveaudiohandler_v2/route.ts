import axios from 'axios'
import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'
import OpenAI from "openai";

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

  var stringAboutEnvironment = ''
  for (let i = 0; i < images.length; i++) { // Fixed loop condition
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
      console.error("Error processing image:", i, error) // More detailed error logging
    }
  }

  switch (flag) {
    case 0:
      try{
        
      
      }
    case 1:
      try {
 
        const openai = new OpenAI({
          apiKey: process.env.GPT_KEY,
        });
      
        const aggregatedString = "With this environment, " + stringAboutEnvironment + " can you describe to a visually impaired person about the surrounding and summarize it with a maximum of 40 words? "
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: "user", content: aggregatedString}],
          model: "gpt-3.5-turbo",
      });
      
        return NextResponse.json({ data: chatCompletion.choices[0].message })
      } catch (error) {
        console.error("Error calling OpenAI API:", error)
        return NextResponse.json({ error: "Error processing chat request." })
      }

    case 2:
    default:
      return NextResponse.json({ error: "Invalid flag value." })
  }
}

