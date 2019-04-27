import {get, post} from '../lib-shared/api.js'
import { API_PATH, loginToWeb } from '../lib-local/api-web'
import { jsonHeaders } from '../lib-shared/json'


const endPoint = API_PATH + '/web/login'

describe("Invalid Login", ()=> {
    test("GET disabled for login", async () => {
        const resp = await get(endPoint, jsonHeaders, 405)
        expect(resp.success).toBeFalsy()
    })

    test("Invalid Username and Password", async ()=> {
        const req = {
            "username": "invalid_username",
            "password": "invalid_password"
        }
        const resp = await post(endPoint, req, jsonHeaders, 400)
        expect(resp.success).toBeFalsy()
    })
    test("Invalid Password", async () => {
        const req = {
            "username": process.env.KITEAPI_WEB_USR,
            "password": "invalid_password"
        }
        const resp = await post(endPoint, req, jsonHeaders, 400)
        expect(resp.success).toBeFalsy()
    })
    test("Invalid Username", async () => {
        const req = {
            "username": "invalid_username",
            "password": process.env.KITEAPI_WEB_PWD
        }
        const resp = await post(endPoint, req, jsonHeaders, 400)
        expect(resp.success).toBeFalsy()
    })
})

describe("Valid Login", () => {
    test("Receive valid authToken", async () => {
        const authToken = await loginToWeb()
        const authTokenMinLength = 10
        expect(authToken.length).toBeGreaterThan(authTokenMinLength)
    })

})

