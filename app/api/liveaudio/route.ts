
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    const {data} = await request.json();
    const lowercaseString = data.toLowerCase(); 
    var arrOfCache = await redis.lrange('cache', 0, -1)
    const lengthOfCache = arrOfCache.length

    arrOfCache.push(lowercaseString)

    const concatenatedString = arrOfCache.join(" ");
    const arrayOfsubString = ["what is written here", "describe to me the surrounding", "what is in-front of me"]
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
        await redis.rpush('cache', lowercaseString)
    }

    return NextResponse.json({ flag: found });
}