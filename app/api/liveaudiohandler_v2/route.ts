import axios from 'axios'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Convert the Base64 image to a Blob

export async function POST(request: Request) {
  const { images, flag } = await request.json()

  switch (flag) {
    case 0:
      console.log('flag 0 -> What is written here')
      try {
        const image = images[0]
        const response = await axios.post('/api/ocr', {
          image,
        })
        return NextResponse.json({
          data: response.data.data,
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
          const response = await axios.post('/api/imgr', {
            image,
          })
          stringAboutEnvironment += response.data.short_description
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
