const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input15small.txt"),
  crlfDelay: Infinity
});

const fileOutput = fs.createWriteStream('output15small.txt', {
    flags: 'w' 
  })  

const map = []

rl.on("line", line => {
    let lineChars = []
    for (let i = 0; i < line.length; i++) {
        lineChars.push(line.charAt(i))
    }
    map.push(lineChars)
})

rl.on("close", () => {
    writeMap()

    const units = initialiseUnits()
    let noMoreTargets = false

    for (let roundCount = 1; roundCount < 2; roundCount++) {
        // sort units by reading order
        sortUnits(units)

        // console.log(JSON.stringify(units))

        // iterate over all units that are still alive
        units.forEach(unit => {
            // console.log(`unit: ${JSON.stringify(unit)}`)
            if (!unit.isAlive) {
                return
            }

            let targets = collectTargets(unit, units)
            if (targets.length === 0) {
                // console.log(`no more targets`)
                noMoreTargets = true
                return
            }

            let targetSpaces = findOpenSquaresAtTargets(unit, targets)

            // If already in range of an enemy -> attack straight away
            
            if (targetSpaces.length === 0) {
                // No spaces next to any targets are free -> nothing to do
                return
            }
            // If not,
                // 1. try to move into the range of an enemy

                moveTowardsClosestTarget(unit, targetSpaces)
                // 2. attack if an enemy is in range

            console.log(`targetSpaces: ${JSON.stringify(targetSpaces)}`)


        })

        if (noMoreTargets) {
            break
        }
    }

})

function moveTowardsClosestTarget(currentUnit, targetPositions) {
    
}

function findOpenSquaresAtTargets(currentUnit, targets) {
    const targetPositions = []
    targets.forEach(otherUnit => {
        if (otherUnit.team !== currentUnit.team) {
            addPossibleTargetField({
                yIndex: otherUnit.yIndex + 1,
                xIndex: otherUnit.xIndex
            }, targetPositions)
            addPossibleTargetField({
                yIndex: otherUnit.yIndex,
                xIndex: otherUnit.xIndex + 1
            }, targetPositions)
            addPossibleTargetField({
                yIndex: otherUnit.yIndex - 1,
                xIndex: otherUnit.xIndex
            }, targetPositions)
            addPossibleTargetField({
                yIndex: otherUnit.yIndex,
                xIndex: otherUnit.xIndex - 1
            }, targetPositions)
        }
    })
    return targetPositions
}

function addPossibleTargetField(position, targetPositions) {
    if (map[position.yIndex][position.xIndex] === '.') {
        targetPositions.push({
            yIndex: position.yIndex,
            xIndex: position.xIndex
        })
    }
}

function collectTargets(unit, units) {
    return units.filter(otherUnit => 
        otherUnit.id !== unit.id &&
        otherUnit.team !== unit.team &&
        otherUnit.isAlive
    )
}

function sortUnits(units) {
    units.sort((a, b) => {
        if (a.yIndex < b.yIndex) {
          return -1
        }
        if (a.yIndex > b.yIndex) {
          return 1
        }
        return a.xIndex - b.xIndex
      })
}

function initialiseUnits() {
    const units = []
    let unitId = 0
    map.forEach((row, yIndex) => {
        row.forEach((cell, xIndex) => {
            if (cell === 'G' || cell === 'E') {
                units.push({
                    id: unitId++,
                    team: cell,
                    xIndex,
                    yIndex,
                    hitPoints: 200,
                    attackPower: 3,
                    isAlive: true
                })
            }
        })
    })
    return units
}

function writeMap() {
    map.forEach(row => {
      fileOutput.write(row.join(''))
      fileOutput.write('\n')
    })
  }