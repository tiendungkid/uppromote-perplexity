const ExcelJS = require('exceljs')

const handler = {

    errorCounter: 0,

    getKeyword: async () => {
        const keywordFilePath = './resources/origin/keyword.xlsx'
        let workbook

        const getWorkbook = async function (filePath) {
            const wb = new ExcelJS.Workbook
            return await wb.xlsx.readFile(filePath).catch(() => null)
        }

        workbook = await getWorkbook(keywordFilePath)

        if (!workbook) return

        const sheet = workbook.getWorksheet(1)

        console.log(`✔ Loaded ${sheet.rowCount} keywords`)

        const keywords = []
        sheet.eachRow((row, rowNumber) => {
            if (!row.getCell('A').value) return
            if (row.getCell('B')) return
            keywords.push({
                keyword: row.getCell('A').value,
                row: rowNumber
            })
        })
        return {
            filePath: keywordFilePath,
            keywords
        }
    },

    writeResult: async (rowNumber, content) => {
        const writeFileResultPath = './resources/result/keyword.xlsx'
        const W = new ExcelJS.Workbook
        const workbook = await W.xlsx.readFile(writeFileResultPath).catch(() => null)
        if (!workbook) return

        const sheet = workbook.getWorksheet(1)
        const row = sheet.getRow(rowNumber)

        row.getCell('B').value = content

        workbook.xlsx.writeFile(writeFileResultPath).then(() => {
            console.log(`Saved result (keyword): ${content}`)
        })
    }
}

module.exports = handler
