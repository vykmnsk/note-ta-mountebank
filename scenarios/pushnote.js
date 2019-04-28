import { loginToWeb, createAppUserSession } from '../lib-local/api-web'
import { createTestAppUser } from '../lib-local/api-testing'
import { delay, retryOnFailure } from '../lib-shared/any'
import { getRecordedRequests } from '../lib-shared/mountebank'
import { jpFindFirst } from '../lib-shared/json'
const config = require('../config.json')

const mockPort = config.mock.google.port
const mockPath = config.mock.google.path.pushnote


describe("Mocked Firebase", () => {
    let userData
    beforeEach(async () => {
        userData = await createTestAppUser();
        expect(userData).not.toBeNull()
        console.log("New User:\n", userData)
    })

    test("Push notification for new Session", async () => {
        jest.setTimeout(180000)

        const appUserId = userData.appUserUuid
        const pushToken = userData.pushToken
        expect(appUserId).toBeTruthy()
        expect(pushToken).toBeTruthy()

        const authToken = await loginToWeb()
        const sessionId = await createAppUserSession(authToken, appUserId)
        console.log("Created a Session with ID=", sessionId)
        // await delay(100) // allow SuT time to generate push note


        const findMatchingReq = async () => {
            const allRequests = await getRecordedRequests(mockPort, mockPath)
            expect(allRequests).toBeTruthy()
            const found = allRequests.find(r => jpFindFirst(r.body, '$.to') == pushToken)
            expect(found).toBeTruthy()
            console.log("---> Found prior request:", found)
            return found
        }

        const reqFound = await retryOnFailure(findMatchingReq, [], 3, 500)

        expect(jpFindFirst(reqFound.body, '$.data.code')
            ).toEqual("SESSION_CREATED")
    })

})
