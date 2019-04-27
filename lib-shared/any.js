const config = require('../config.json')
require.requireActual('babel-polyfill')

export const envName = process.env[config.sutName + '_ENV']
expect(envName).toBeTruthy()

export const randomStr = (size) => {
    return Math.random().toString(36).substr(2, size)
}

export const delay = (ms) => {
    return new Promise(res => setTimeout(res, ms))
}

export const epochMillis = () => {
    return new Date().getTime()
}

export const retryOnFailure = async (func, args, maxTries, sleepMs) => {
    for (let i = 1; i <= maxTries; i++) {
        if (i > 1) {
            await delay(sleepMs)
        }
        try {
            return await func.apply(null, args)
        } catch(error) {
            console.log(`Tried ${i} - ${error}`)
        }
    }
    fail(`Exhausted ${maxTries} attempts for previous errors`)
}