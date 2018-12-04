const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input1.txt'),
    crlfDelay: Infinity
})

let frequency = 0

rl.on('line', (line) => {
    frequency += parseInt(line, 10)
    console.log(`Line from file: ${line}`);
});

rl.on('close', () => {
    console.log('Frequency: '+ frequency)
})