const config = require('../config.json')
import { post } from '../lib-shared/api.js'
import { jsonHeaders } from '../lib-shared/json.js';

const API_PATH = config.testApiPath
const TESTING_AUTH = process.env[config.sutName + '_TESTING_AUTH']
const COMPANY_ID = process.env[config.sutName + '_COMPANY_ID']
const MANAGER_ID = process.env[config.sutName + '_MANAGER_ID']
const APP_USER_MOBILE = process.env[config.sutName + '_APP_USER_MOBILE']
expect(TESTING_AUTH).toBeTruthy()
expect(COMPANY_ID).toBeTruthy()
expect(MANAGER_ID).toBeTruthy()
expect(APP_USER_MOBILE).toBeTruthy()

export const createTestAppUser = async () => {
    const headers = {
        ...jsonHeaders,
        ...{'Authorization': 'Bearer ' + TESTING_AUTH}
    }
    const req = {
        "companyUuid": COMPANY_ID,
        "managerUuid": MANAGER_ID,
        "mobileNumber": APP_USER_MOBILE
    }
    const userData = await post(API_PATH + '/setup', req, headers)
    expect(userData.deviceUuid).toBeTruthy()
    expect(userData.authToken).toBeTruthy()
    return userData
}
