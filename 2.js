const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input2.txt'),
    crlfDelay: Infinity
})

let threeLetters = 0
let twoLetters = 0
let charCounts = {}
let foundThreeLetters
let foundTwoLetters

rl.on('line', (line) => {
    let currentChar
    charCounts = {}
    foundThreeLetters = false
    foundTwoLetters = false

    for (let i = 0; i < line.length; i++) {
        currentChar = line.charAt(i)
        if (charCounts.hasOwnProperty(currentChar)) {
            charCounts[currentChar] += 1
        } else {
            charCounts[currentChar] = 1
        }
    }

    for (let char in charCounts) {
        if (charCounts[char] === 3 && !foundThreeLetters) {
            threeLetters += 1
            foundThreeLetters = true
        } else if (charCounts[char] === 2 && !foundTwoLetters) {
            twoLetters += 1
            foundTwoLetters = true
        }
    }
})

rl.on('close', () => {
    console.log('threeLetters: '+ threeLetters)
    console.log('twoLetters: '+ twoLetters)
    console.log('product: '+ threeLetters * twoLetters)
})