const prompts = require('prompts')

module.exports = async function askForChromeExecutablePath() {
    const executablePaths = {
        win: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        osx: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        other: 'Input chrome executable path'
    }

    const response = await prompts([
        {
            type: 'select',
            name: 'platform',
            message: 'Which operating system are you using?',
            choices: [
                {title: 'Window', value: 'win', description: executablePaths.win},
                {title: 'MacOS', value: 'osx', description: executablePaths.osx},
                {title: 'Other', value: 'other', description: executablePaths.other}
            ]
        },
        {
            type: 'text',
            name: 'executablePath',
            message: 'Chrome executable path:',
            validate: value => value.length > 3
        }
    ], {
        onSubmit: (prompt, answer) => {
            if (prompt.name !== 'platform') return false
            return answer !== 'other'
        }
    })

    if (response.platform === 'other') return {
        platform: 'other',
        executePath: response.executablePath
    }

    return {
        platform: response.platform,
        executePath: executablePaths[response.platform]
    }
}
