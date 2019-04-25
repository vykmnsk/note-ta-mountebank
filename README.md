# API Backend Test Automation

## Local setup
1. Download/install latest Node from https://nodejs.org/en/download/
1. Git clone the repo
1. Go into the project directory
1. Install all project dependencies (node libraries)
   ```bash
   npm install
   ```
1. Set environment variables:
    * TESTAPI_ENV //environment name where SuT is deployed [staging|dev]
    * TESTAPI_WEB_USR //Manager's username
    * TESTAPI_WEB_PWD //Managers password
    * TESTAPI_TESTING_AUTH // Test API security key
    * TESTAPI_COMPANY_ID // Test API needs this to create test app users
    * TESTAPI_MANAGER_ID // Test API needs this to create test app users
    * TESTAPI_APP_USER_MOBILE // Test API needs this to create test app users


## Test Run options
1. Run smoke tests
    ```
    npm run smoke
    ```
1. Run scenario based tests
    ```
    npm run scenarios
    ```
1. Run all tests
    ```
    npm run all
    ```
1. Run particular test file
    ```
    npm run all -- web-login
    ```
1. Run particular test by its name
   ```
   npm run all -- -t "can raise manual alarm"
   ```

## Mock server
Start the mock server as a separate process before running tests which rely on it
```
npm run mock-start
```
Then (in a different process)

run some tests ...

stop the mock server (when done testing):
```
npm run mock-stop
```

## CI/CD
Generate JUnit report
```
npm run all -- --ci --reporters=default --reporters=jest-junit
```
