const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: fs.createReadStream('input6.txt'),
    crlfDelay: Infinity
})

const gridFileOutput = fs.createWriteStream('output6.txt', {
    flags: 'w' 
})

let points = []
let charCode = 97

rl.on('line', (line) => {
    matches = line.match(/(\d+), (\d+)/)
    if (matches && matches.length === 3) {
        points.push({
            x: matches[1],
            y: matches[2],
            id: String.fromCharCode(charCode)
        })
    }
    charCode++
});

const GRID_SIZE = 360
const MAX_REGION_DISTANCE = 10000

rl.on('close', () => {
    const grid = drawInitialGrid(GRID_SIZE)
    addPointsToGrid(grid)
    measureDistances(grid)

    const largestArea = findLargestFiniteArea(grid)
    console.log(`largestArea: ${largestArea}`)

    const largestRegion = markLargestRegion(grid)
    console.log(`largest region: ${largestRegion}`)
    writeGridToFile(grid, gridFileOutput)
})

function drawInitialGrid() {
    const grid = []
    for (let i = 0; i < GRID_SIZE; i++) {
        grid.push([])
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i].push('.')
        }
    }
    return grid
}

function writeGridToFile(grid, outFile) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            outFile.write(grid[i][j])
        }
        outFile.write('\n')
    }
}

function addPointsToGrid(grid) {
    points.forEach(point => {
        grid[point.y][point.x] = point.id
    })
}

function measureDistances(grid) {
    let closestPoint
    grid.forEach((line, y) => {
        line.forEach((point, x) => {
            closestPoint = findClosestPoint(x, y)
            grid[y][x] = closestPoint
        })
    })
}

function findClosestPoint(x, y) {
    let minDistance = Number.MAX_SAFE_INTEGER
    let currentDistance
    let minDistancePointId = null
    let allDistances = []

    for (let i = 0; i < points.length; i++) {
        point = points[i]
        currentDistance = Math.abs(point.x - x) + Math.abs(point.y - y) 
        if (currentDistance === 0) {
            // Early return, nothing can be closer than the point itself.
            return point.id
        }
        if (currentDistance < minDistance) {
            minDistance = currentDistance
            minDistancePointId = point.id
        }
        allDistances.push(currentDistance)
    }
    if (allDistances.filter(distance => {
        return distance === minDistance
    }).length > 1) {
        return '.'
    }
    return minDistancePointId
}

function findLargestFiniteArea(grid) {
    let maxAreaSize = 0
    let maxAreaLetter
    let currentLetter
    let currentPointAreaSize
    let currentPointId
    let isFinite

    points.forEach(point => {
        currentPointAreaSize = 0
        currentPointId = point.id
        isFinite = true

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                currentLetter = grid[i][j]
                if (currentLetter === currentPointId) {
                    currentPointAreaSize++

                    // If we're at the edges, it's an infinite area.
                    if (i === grid.length - 1 || j === grid[i].length -1 || i === 0 || j === 0) {
                        isFinite = false
                    }
                }
            }
        }
        if (isFinite && currentPointAreaSize > maxAreaSize) {
            maxAreaSize = currentPointAreaSize
            maxAreaLetter = currentPointId
        }
    })

    return maxAreaSize
}

function markLargestRegion(grid) {
    let distanceToAllPoints
    let point
    let maxRegionCount = 0

    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            distanceToAllPoints = 0
            for (let i = 0; i < points.length; i++) {
                point = points[i]
                currentDistance = Math.abs(point.x - x) + Math.abs(point.y - y) 
                distanceToAllPoints += currentDistance
                if (distanceToAllPoints >= MAX_REGION_DISTANCE) {
                    break
                }
            }
            if (distanceToAllPoints < MAX_REGION_DISTANCE) {
                grid[x][y] = '#'
                maxRegionCount ++
            }
        }
    }

    return maxRegionCount
}