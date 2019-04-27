const jp = require('jsonpath')


export const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

export const jpFindFirst = (input, jpath) => {
    let jinput
    try {
        jinput = JSON.parse(input);
    } catch (e) {
        return null
    }
    const allFound = jp.query(jinput, jpath)
    if (allFound.length >= 1) {
        return allFound[0]
    }
}