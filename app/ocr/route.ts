import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js';


/* Sends a GET request to PERENUAL to get the ID of the plant based on name */
/* Returns a response data which contains ID of the plant */
export async function POST(request: Request) {
  console.log("test")
  try {
    const imageUrl = 'https://tesseract.projectnaptha.com/img/eng_bw.png'; // Replace with your image URL
    
    const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng');
    console.log(text)
    NextResponse.json({text: text})
   
  } catch (error) {
    console.error('OCR Error:', error);
  
  }
}