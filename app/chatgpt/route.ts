import { NextResponse } from "next/server";
import Bard from "bard-ai";

export async function GET (request:Request) {

    let myBard = new Bard(process.env.PSID_1);

    console.log(await myBard.ask("Hello, world!"));

    return NextResponse.json({abc:"all"});
} 