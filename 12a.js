const readline = require('readline')
const fs = require('fs')
const memoize = require('fast-memoize')

const rl = readline.createInterface({
    input: fs.createReadStream('input12.txt'),
    crlfDelay: Infinity
})

const rules = {}
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
        rules[leftSide] = rightSide
        
    }
});

rl.on('close', () => {
    // console.log(JSON.stringify(initialState))
    // console.log(JSON.stringify(pots))
    startBreeding(initialState)
})

function startBreeding(initialState) {
    let rowOfPots
    let matchingRule
    let pots = initialState
    const generations = [pots]
    let genCount = 0
    let indicesShift = 0
    // const RUNS = 20
    const RUNS = 50000000000

    while (genCount < RUNS) {
        if (genCount % 1000 === 0) {
            console.log(`Got ${genCount / 1000} THOUSAND of 50 000`)
        }
        // console.log('potsLength', pots.length)
        if (!pots.startsWith('...')) {
            pots = `...${pots}`
            indicesShift += 3
        }
        if (!pots.endsWith('...')) {
            pots = `${pots}...`
        }

        let nextGeneration = []
        for (let j = 0; j < pots.length; j++) {
            nextGeneration.push('.')
        }
        for (let i = 0; i < pots.length - 5; i++) {
            rowOfPots = pots.substr(i, 5)
            matchingRule = rules[rowOfPots]
            if (matchingRule) {
                // console.log(`matchingRule at ${i}: ${JSON.stringify(matchingRule)}`)
                nextGeneration[i + 2] = matchingRule.rightSide
            }
        }
        pots = nextGeneration.join('')
        generations.push(pots)
        genCount++
    }
    // console.log(generations.join('\n'))

    const lastGen = generations[RUNS]
    let sumOfPlantIndices = 0
    console.log('lastGen', lastGen)
    for (let i = 0; i < lastGen.length; i++) {
        if (lastGen.charAt(i) === '#') {
            sumOfPlantIndices += (i - indicesShift)
        }
    }
    console.log(`sumOfPlantIndices  ${sumOfPlantIndices} `)
}
