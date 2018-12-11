const INPUT = 4842
// const INPUT = 18

const GRID_SIZE = 300

let grid = calculateCellPowers()
let maxCell
let overallMaxPowerLevel =  Number.MIN_SAFE_INTEGER
let overallMaxCell
let overallMaxCellCellSize

for (let cellSize = 1; cellSize <= GRID_SIZE; cellSize++) {
    maxCell = findMaxCell(grid, cellSize)
    console.log(`maxCell for size ${cellSize}: ${JSON.stringify(maxCell)}`)
    if (maxCell.powerLevel > overallMaxPowerLevel) {
        overallMaxPowerLevel = maxCell.powerLevel
        overallMaxCell = maxCell
        overallMaxCellCellSize = cellSize
    }
}

console.log(`Overall max power level at ${JSON.stringify(overallMaxCell)} cellSize: ${overallMaxCellCellSize}`)

function calculateCellPowers() {
    const grid = []
    let powers  = ''
    for (let y = 0; y < GRID_SIZE; y++) {
        grid[y] = []
        for (let x = 0; x < GRID_SIZE; x++) {
            grid[y].push({
                x: x+1,
                y: y+1,
                powerLevel: getPowerLevel(x + 1, y + 1)
            })
        }
    }
    return grid
}


function findMaxCell(grid, cellSize) {
    const cells = []
    let currentCell
    for (let yStart = 0; yStart < grid.length - cellSize; yStart++) {
        for (let xStart = 0; xStart < grid[yStart].length - cellSize; xStart++) {
            currentCell = {
                x: xStart + 1,
                y: yStart + 1,
                powerLevel: 0
            }
            for (let y = yStart; y < yStart + cellSize; y++) {
                for (let x = xStart; x < xStart + cellSize; x++) {
                    currentCell.powerLevel += grid[y][x].powerLevel
                }
            }
            cells.push(currentCell)
        }
    }
    
    let maxPowerLevel = Number.MIN_SAFE_INTEGER
    let maxCell
    
    cells.forEach(cell => {
        if (cell.powerLevel > maxPowerLevel) {
            maxPowerLevel = cell.powerLevel
            maxCell = cell
        }
    })

    return maxCell
}

function getPowerLevel(x, y) {
    const rackId = x + 10
    let powerLevel = rackId * y
    powerLevel += INPUT
    powerLevel *= rackId
    powerLevel = Math.floor(powerLevel / 100 % 10)
    powerLevel -= 5
    // if (x === 122 && y== 79) {
        // console.log(`powerLevel ${powerLevel}`)
    // }
    return powerLevel
}