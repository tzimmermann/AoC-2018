const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input12.txt'),
    crlfDelay: Infinity
})

const rules = []
let initialState

rl.on('line', (line) => {
    let matches
    let leftSide
    let rightSide
    
    if (line.startsWith('initial state:')) {
        initialState = line.match(/initial state: ([\.#]+)/)[1]
    } else if (line.startsWith('#') || line.startsWith('.')) {
        matches = line.match(/([\.#]{5}) => ([\.#])/)
        leftSide = matches[1]
        rightSide = matches[2]
        rules.push({
            offsets: {
                '-2': leftSide.charAt(0),
                '-1': leftSide.charAt(1),
                '0': leftSide.charAt(2),
                '1': leftSide.charAt(3),
                '2': leftSide.charAt(4),
            },
            result: rightSide
        })
    }
});

rl.on('close', () => {
    // console.log(JSON.stringify(initialState))
    const pots = {}
    fillInInitialState(pots)
    // console.log(JSON.stringify(pots))
    startBreeding(pots)
})

function fillInInitialState(pots) {
    for (let i = 0; i < initialState.length; i++) {
        pots[i] = initialState.charAt(i)
    }
}

function startBreeding(pots) {
    let pot
    let result
    let generations = [{}]
    for (let index in pots) {
        pot = pots[index]
        if (pot === '#') {
            result = findRuleResult(pots, index)
        }
        generations[0][index] = result
    }
    console.log(JSON.stringify(generations))
}

function findRuleResult(pots, index) {
    let matchingResult = null

    // Use `some` to short-circuit in case a match was found.
    const ruleMatches = rules.some(rule => {
        const { offsets, result } = rule
        let matches = true
        for (let offset in offsets) {
            const offsetNo = parseInt(offset, 10)
            const potToCheck = pots[index + offsetNo]
            const potToMatch = offsets[offset]
            if (potToCheck !== potToMatch || 
                (potToCheck === undefined && potToMatch !== '.')) {
                matches = false
            }
        }
        matchingResult = result
        return matches
    })

    return matchingResult
}
