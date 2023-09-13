const prompts = require('prompts')

module.exports = async function setCookie() {
    return await prompts({
        type: 'select',
        name: 'thread',
        message: 'Thread',
        choices: [
            {
                title: 1,
                value: 1
            },
            {
                title: 2,
                value: 2
            },
            {
                title: 3,
                value: 3
            },
            {
                title: 4,
                value: 4
            },
            {
                title: 5,
                value: 5
            }
        ]
    })
}
