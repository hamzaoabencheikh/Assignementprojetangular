const fs = require('fs')

const data = JSON.parse(fs.readFileSync('./MOCK_DATA.json', 'utf-8'))

console.log(data)