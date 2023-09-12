const prompts = require('prompts')

module.exports = async function setCookie() {
    return await prompts({
        type: 'text',
        name: 'cookie',
        message: 'Cookie'
    })
}
