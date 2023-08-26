
import { NextResponse } from "next/server";

export async function GET (request:Request) {
    var eventFlag = 0

    // fetch from redis
    var cached = ""
    var audio = ""
    // apped text to

    // check if flag triggered
    
    // insert to redis

    return NextResponse.json({flag: eventFlag});
}