const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input1.txt'),
    crlfDelay: Infinity
})

let currentFrequency = 0
let seenFrequencies = [currentFrequency]
let frequencyChanges = []

rl.on('line', (line) => {
    frequencyChanges.push(parseInt(line, 10))
})

let duplicateFrequency
rl.on('close', () => {    
    for (let i = 0; i<500; i++) {
        frequencyChanges.forEach((frequencyChange, j) => {
            currentFrequency += frequencyChange

            if (seenFrequencies.includes(currentFrequency)) {
                console.log('Found duplicate frequency: ' + currentFrequency)
                console.log('Found duplicate frequency at loop: ' + i)
                console.log('Found duplicate frequency at freq: ' + j)
                throw new Error('Found duplicate frequency: ' + currentFrequency)
            }
            seenFrequencies.push(currentFrequency)
        })
        console.log('Seen this many frequencies: '+ seenFrequencies.length)
        console.log('currentFrequency at run ' + i + ' : '+ currentFrequency)
    }
    
    console.log('Frequency: '+ currentFrequency)
})