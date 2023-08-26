import {Redis} from "ioredis"

const getRedisUrl = () => {
    if(process.env.REDIS_URL){
        return process.env.REDIS_URL
    }

    throw new Error('REDIS_URL not defined')
}

export const redis = new Redis(getRedisUrl());