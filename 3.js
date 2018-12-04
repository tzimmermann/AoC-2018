const readline = require('readline')
const fs = require('fs')

const inputFile = readline.createInterface({
    input: fs.createReadStream('input3.txt'),
    crlfDelay: Infinity
})

const fabricFileOutput = fs.createWriteStream('output3.txt', {
    flags: 'w' 
})

let fabricMap = []
let claims = []
const FABRIC_DIMENSION = 1000

for (let j = 0; j < FABRIC_DIMENSION; j++) {
    fabricMap.push([])
    for (let i = 0; i < FABRIC_DIMENSION; i++) {
        fabricMap[j].push('.')
    }
}
  
function addClaimToFabric(claim) {
    let row = claim.fromTop
    let column = claim.fromLeft

    for (let y = row; y < row + claim.height; y++) {
        for (let x = column; x < column + claim.width; x++) {
            if (fabricMap[y][x] === '.') {
                fabricMap[y][x] = '1'
            } else if (fabricMap[y][x] === '1') {
                fabricMap[y][x] = 'X'
            }
        }
    } 
}

inputFile.on('line', (line) => {
    let match = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/)
    const claim = {        
        id: match[1],
        fromLeft: parseInt(match[2], 10),
        fromTop: parseInt(match[3], 10),
        width: parseInt(match[4], 10),
        height: parseInt(match[5], 10),
    }
    claims.push(claim)
    addClaimToFabric(claim)
})

inputFile.on('close', () => {
    const overlapCount = getOverlaps()
    
    const nonOverlappingClaimId = getNonOverlappingClaim()

    console.log('Inches that are claimed by two or more claims: ' + overlapCount)
    console.log(`Claim with ID ${nonOverlappingClaimId} does not overlap!`)

})

function getOverlaps() {
    let currentChar
    let overlapCount = 0

    for (let i = 0; i < fabricMap.length; i++) {
        for (let j = 0; j < fabricMap[i].length; j++) {
            currentChar = fabricMap[i][j]
            if (currentChar === 'X') {
                overlapCount += 1
            }
            fabricFileOutput.write(currentChar)
        }
        fabricFileOutput.write('\n')
    }
    return overlapCount
}

function getNonOverlappingClaim() {
    let nonOverlappingClaimId = null
    claims.forEach(claim => {
        let doesOverlap = doesClaimOverlap(claim)
        if (!doesOverlap) {
            nonOverlappingClaimId = claim.id
        }
    })
    return nonOverlappingClaimId
}

function doesClaimOverlap(claim) {
    let row = claim.fromTop
    let column = claim.fromLeft
    for (let y = row; y < row + claim.height; y++) {
        for (let x = column; x < column + claim.width; x++) {
            if (fabricMap[y][x] === 'X') {
                return true
            }
        }
    }
    return false
}