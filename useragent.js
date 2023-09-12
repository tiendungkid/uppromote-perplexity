const prompts = require('prompts')

module.exports = async function askForUserAgent(platform = '') {

    const userAgents = {
        win: {
            name: 'Window',
            agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        },
        osx: {
            name: 'MacOS',
            agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        },
        other: {
            name: 'Other',
            agent: null
        }
    }

    const response = await prompts([
        {
            type: 'select',
            name: 'type',
            message: 'User agent:',
            choices: [
                {
                    title: 'Default',
                    value: 'default',
                    description: `By selected platform (${userAgents[platform].name})`
                },
                {
                    title: 'Provide your User Agent',
                    value: 'custom'
                }
            ]
        },
        {
            type: 'text',
            name: 'userAgent',
            message: 'Enter your user agent:'
        }
    ], {
        onSubmit: (prompt, answer) => {
            if (prompt.name !== 'type') return false

            if (answer === 'default') return ['osx', 'win'].includes(platform)
        }
    })

    if (response.type === 'default') {
        return ['osx', 'win'].includes(platform)
            ? userAgents[platform].agent
            : response.userAgent
    }

    return response.userAgent
}
