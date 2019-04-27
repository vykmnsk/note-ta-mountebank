import { envName } from './any.js'
const config = require('../config.json')
const fetch = require('node-fetch')


const apiBaseUrl = config.env[envName].apiHost

export const get = async (url, headers = {}, expectCode=false, expectJson=true) => {
    console.log("GET: ", absolutePath(url), "with headers=", headers)
    
    const resp = await fetch(absolutePath(url), { 
        method: 'get', 
        headers: headers
    }).catch(e => console.log("GET error", e.message))
    return await verifyResponse(resp, expectCode, expectJson)
}

export const post = async (url, req, headers={}, expectCode=false, expectJson=true) => {
    console.log("POST to: ", absolutePath(url), "with headers=", headers)

    const resp = await fetch(absolutePath(url), {
        method: 'post',
        body: JSON.stringify(req),
        headers: headers
    }).catch(e => console.log("POST error", e.message))
    return await verifyResponse(resp, expectCode, expectJson)
}

const absolutePath = (url) => {
    let absUrl = url
    if (!url.startsWith('http')) {
        absUrl = apiBaseUrl + url
    }
    return absUrl
}

const verifyResponse = async (resp, expectCode, expectJson) => {
    let vresp
    const respText = await resp.text()
    const respInfo = `${resp.status}:${respText}`

    if (expectCode) {
        expect(resp.status, respInfo).toEqual(expectCode)
    } else {
        expect(resp.ok, respInfo).toBeTruthy()
    }

    if (expectJson) {
        expect(resp.headers.get('content-type'), respInfo).toContain('json')
        try {
            vresp = JSON.parse(respText)
        } catch (error) {
            expect(error).toBeFalsy()
        }
    } else {
        vresp = resp
    }
    return vresp
}
