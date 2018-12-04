const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('input2.txt'),
  crlfDelay: Infinity
});

let words = []

rl.on('line', (line) => {
    words.push(line)
});

function getDiffs(word1, word2) {
    let word1char
    let word2char
    let diffs = 0
    for (let i = 0; i < word1.length; i++) {
        word1char = word1.charAt(i)
        word2char = word2.charAt(i)
        if (word1char !== word2char) {
            diffs += 1
        }
    }
    return diffs
    
}

rl.on('close', () => {
    words.forEach(word1 => {
        words.forEach(word2 => {
            if (word1 === word2) {
                return
            }
            diffs = getDiffs(word1, word2)
            if (diffs === 1) {
                let result = ''
                for (let i = 0; i < word1.length; i++) {
                    word1char = word1.charAt(i)
                    word2char = word2.charAt(i)
                    if (word1char === word2char) {
                        result += word1char
                    }
                }
                    
                throw new Error('Excatly one diff: ' + result)
            }
        })
    })
})