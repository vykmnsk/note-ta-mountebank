import { randomStr, delay } from '../lib-shared/any.js'
import { simulateExtCall, getRecordedRequests } from '../lib-shared/mountebank'
const config = require('../config.json')


const generateTestData = (label) => {
    return { "test": [label, randomStr(10)].join('_') }
}

const matchReqBody = (req, withData) => {
    return req.body.startsWith(JSON.stringify(withData))
}


describe("Mountebank setup", () => {
    const mockServices = [
        {
            "name": "Amazon",
            "port": config.mock.amazon.port,
            "paths": [config.mock.amazon.path.email, config.mock.amazon.path.sms],
            "proxy": false
        },
        {
            "name": "Google",
            "port": config.mock.google.port,
            "paths": [config.mock.google.path.pushnote],
            "proxy": true
        }
    ]

    mockServices.forEach( async (service) => {
        describe(service.name, () => {
            service.paths.forEach( async (servicePath) => {
                test("Receive request to " + servicePath, async () => {
                    const testData = generateTestData(servicePath)
                    await simulateExtCall(service.port, servicePath, testData, service.proxy)
                    await delay(100)
                    const allServiceRequests = await getRecordedRequests(service.port, servicePath)
                    expect(allServiceRequests).toBeTruthy()
                    const ourReq = allServiceRequests.find( r => matchReqBody(r, testData) )
                    expect(ourReq).toBeTruthy()
                    // console.log("---> Found prior request:", ourReq)
                })
            })
        })
    })

})
