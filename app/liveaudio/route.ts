
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

// mp3 

const speech = require('@google-cloud/speech');

// Instantiates a client
const client = new speech.SpeechClient();

// The path to the remote LINEAR16 file
const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';


async function transcribeSpeech() {

    const audio = {
      uri: gcsUri,
    };
  
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
  
    const request = {
      audio: audio,
      config: config,
    };
  
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  }

export async function POST(request: Request) {

    const body = await request.json();
    transcribeSpeech();
    var arrOfCache = await redis.lrange('cache', 0, -1)
    const lengthOfCache = arrOfCache.length
    arrOfCache.push("")

    // Concatinate the string 
    const concatenatedString = arrOfCache.join(" ");
    const arrayOfsubString = ["What is written here", "describe to me the surrounding", "What is in-front of me"]
    var found = -1
    var i = 0

    while (i < arrayOfsubString.length) {
        var currentString = arrayOfsubString[i];
        const indexOfFirstMatch = concatenatedString.search(currentString)
        // If found - > exit
        if (indexOfFirstMatch != -1) {
            found = i
            break
        }
        i++;
    }


    // if found -> return flag
    if (found != -1) {
        await redis.del('cache')
        return NextResponse.json({ flag: found })

        // if not found 
    } else {
        if (lengthOfCache == 5) {
            await redis.lpop('cache')
        }
        await redis.rpush('cache', body.data)
    }

    return NextResponse.json({ flag: found });
}