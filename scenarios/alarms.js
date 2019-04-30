import { get, post } from '../lib-shared/api.js'
import { API_PATH, loginToWeb } from '../lib-local/api-web.js'
import { createTestAppUser } from '../lib-local/api-testing.js'
import { epochMillis, delay } from '../lib-shared/any.js'
import { jsonHeaders } from '../lib-shared/json.js';


const readAlarms = async (authToken) => {
    const headers = {
        ...jsonHeaders,
        ...{ 'Authorization': authToken }
    }
    return await get(API_PATH + '/web/alarms', headers)
}

const raiseAlarm = async (deviceId, deviceAuth, timeMillis) => {
    const headers = {
        ...jsonHeaders,
        ...{
            'X-Device-Id': deviceId,
            'Authorization': deviceAuth }
    }
    const req = {
        "startTime": timeMillis,
        "source": "MANUAL",
        "cancellation": "NONE",
        "deviceInfo": {
            "latitude": -23.54,
            "longitude": 185.11,
            "elevation": 0,
            "horizontalAccuracy": 0,
            "verticalAccuracy": 0,
            "batteryLevel": 90,
            "connectionType": "WIFI"
        }
    }
    return await post(API_PATH + '/app/alarm', req, headers)
}

let userData
beforeEach(async () => {
    userData = await createTestAppUser();
    expect(userData).not.toBeNull()
    console.log("New User:\n", userData)
})

describe("Alarms", () => {
    let alarmRaised
    let alarmRaisedTime
    beforeEach(async () => {
        expect(userData).toBeTruthy()

        alarmRaisedTime = epochMillis()
        alarmRaised = await raiseAlarm(userData.deviceUuid, userData.authToken, alarmRaisedTime)
        console.log("Raised Alarm:\n", alarmRaised)
        expect(alarmRaised.source).toBe('MANUAL')
        expect(alarmRaised.cancellation).toBe('NONE')
        expect(alarmRaised.uuid).toBeTruthy()
    })

    test("Can raise alarm", async () => {
        jest.setTimeout(60000)

        expect(alarmRaised).toBeTruthy()

        const authToken = await loginToWeb()
        const mngrAlarms = await readAlarms(authToken)
        // console.log("Manager's Alarms:\n", mngrAlarms)
        expect(mngrAlarms.length).toBeGreaterThan(0)

        const alarmFound = mngrAlarms.find(ma => ma.uuid === alarmRaised.uuid)
        expect(alarmFound).toBeTruthy()
        expect(alarmFound.source).toEqual(alarmRaised.source)
        expect(alarmFound.cancellation).toEqual(alarmRaised.cancellation)
        expect(alarmFound.startTime).toEqual(alarmRaisedTime)
    })

})
