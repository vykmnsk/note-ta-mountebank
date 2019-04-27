import { get, post } from '../lib-shared/api'
import { jsonHeaders } from '../lib-shared/json'
const config = require('../config.json')


const mockHost = config.mock.host
const mockAdminPort = config.mock.admin.port

export const getRecordedRequests = async (apiPort, servicePath) => {
    const imposterDataUrl = `${mockHost}:${mockAdminPort}/imposters/${apiPort}`
    const resp = await get(imposterDataUrl)
    expect(resp.requests).toBeTruthy()
    const serviceRequests = resp.requests.filter(r => r.path === servicePath)
    return serviceRequests
}

export const simulateExtCall = async (mockPort, mockPath, req, viaProxy=false) => {
    const mockedUrl = `${mockHost}:${mockPort}${mockPath}`
    console.log("Simulating mock srv call to ", mockedUrl)
    const expectCode = (viaProxy)? 401 : 200
    return post(mockedUrl, req, jsonHeaders, expectCode, false)
}
