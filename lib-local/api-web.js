import { post } from '../lib-shared/api.js'
import { epochMillis } from '../lib-shared/any.js'
import { jsonHeaders } from '../lib-shared/json.js';
const config = require('../config.json')
const jp = require('jsonpath')


export const API_PATH = config.apiPath
const WEB_USR = process.env[config.sutName + '_WEB_USR']
const WEB_PWD = process.env[config.sutName + '_WEB_PWD']
expect(API_PATH).toBeTruthy()
expect(WEB_USR).toBeTruthy()
expect(WEB_PWD).toBeTruthy()

export const loginToWeb = async () => {
    const req = {
        "username": WEB_USR,
        "password": WEB_PWD
    }
    const resp = await post(API_PATH + '/web/login', req, jsonHeaders)
    expect(resp.authToken).toBeTruthy()
    return resp.authToken
}

export const createAppUserSession = async (authToken, appUserId) => {
    const nowMillis = epochMillis()
    const lag = 10 * 1000  // allow time for network call and machine times out of sync
    const freqMillis = 15 * 60 * 1000 // minimum session is 15 min
    const headers = {
        ...jsonHeaders,
        ...{ 'Authorization': authToken }
    }
    const req = {
        "startTime": nowMillis + lag,
        "endTime": nowMillis + freqMillis + lag,
        "frequency": freqMillis,
        "appUserUuids": [appUserId]
    }
    console.log("Creating new session with:", req)
    const sessionData = await post(API_PATH + '/web/session', req, headers)
    console.log("Session created-=\n", sessionData)
    const sessionId = jp.query(sessionData, '$..uuid')[0]
    return sessionId
}
