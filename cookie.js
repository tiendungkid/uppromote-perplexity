const fs = require('fs')

const getCookie = async () => {
    return await fs.readFileSync(__dirname + `/resources/cookie/cookie.txt`)
}

module.exports = getCookie