const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const platform = require('./prepare')
const agent = require('./useragent')
const keywordExcel = require('./keyword')
const {collect} = require("collect.js");
const cookieHandler = require('./cookie')

puppeteer.use(AdblockerPlugin({blockTrackers: true}))
puppeteer.use(StealthPlugin())


async function runPuppeteer() {

    const cookie = (await cookieHandler()).toString()

    const {
        executePath,
        userAgent
    } = await prepareParams()

    const options = {
        headless: false,
        executablePath: executePath,
    }
    const keywordExcelHandler = await keywordExcel.getKeyword();
    if (!keywordExcelHandler) return

    const keywords = collect(keywordExcelHandler.keywords)
    const detachedKeywords = keywords.chunk(1).toArray()

    const spamFunction = async (item) => {
        const browser = await puppeteer.launch(options)
        return doSpam(browser, item, {userAgent, cookie})
    }

    for (let keywordItem of detachedKeywords) {
        const result = await Promise.all(keywordItem.map(spamFunction))

        if (!result) return;

        result.forEach(itemResult => {
            keywordExcel.writeResult(
                itemResult.row,
                itemResult.result,
                keywordExcelHandler.sheetName
            )
        })
    }
}

async function prepareParams() {
    const {executePath, platform: pl} = await platform()
    const userAgent = await agent(pl)
    return {executePath, platform: pl, userAgent}
}

async function doSpam(browser, item, properties) {
    let {keyword} = item
    const {userAgent, cookie} = properties

    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({'Cookie': cookie})
    await page.setUserAgent(userAgent)
    await page.setViewport({width: 1366, height: 768})
    await page.goto('https://www.perplexity.ai/')

    keyword = keyword.replace('affiliate program', '').trim()
    const questions = [
        `What is the {{name}} affiliate program?`,
        `What products can you promote?`,
        `How does the {{name}} affiliate program work?`,
        `{{name}} affiliate program commission & payouts`,
        `How much does {{name}} affiliate program pay?`,
        `Pros and Cons of {{name}} affiliate program`,
        `How to join {{name}} affiliate program?`,
        `How to promote {{name}} and boost your earnings?`,
        `Who should join the {{name}} affiliate program?`,
        `Is there a fee to join the {{name}} affiliate program?`,
        `Are there any minimum requirements to become a {{name}} affiliate?`,
        `How long does getting approved for the {{name}} affiliate program take?`,
        `How long is the cookie duration for the {{name}} affiliate program?`,
        `What is the payment method for {{name}} affiliates?`,
        `Can the {{name}} program be combined with other affiliate programs?`,
        `What are the best {{name}} affiliate program alternatives?`,
    ].map(question => question.replace('{{name}}', keyword))

    for (let q of questions) {
        await page.type("textarea", q, {delay: 50})
        await page.keyboard.press('Enter');

        try {
            await page.waitForNavigation({waitUntil: "networkidle2"});
        } catch (e) {
            return null
        }

        await page.$eval('main', (node) => {
            node.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'});
        });
        await page.waitForTimeout(2000);
    }
    const url = page.url();
    await browser.close()
    return {
        ...item,
        result: url
    }
}

(runPuppeteer)()
