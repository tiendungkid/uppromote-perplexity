const fs = require('fs')

const getCookie = async () => {
    return fs.readFileSync(__dirname + `/resources/cookie/cookie.txt`);
}

module.exports = getCookie
