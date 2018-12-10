const readline = require("readline");
const fs = require("fs");

OUTFILE = 'output10small.txt'

const rl = readline.createInterface({
  input: fs.createReadStream("input10small.txt"),
  crlfDelay: Infinity
});

const fileOutput = fs.createWriteStream(OUTFILE, {
    flags: 'w' 
})

const points = [
]
rl.on("line", line => {
  const matches = line.match(
    /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/
  );
  const positionX = parseInt(matches[1], 10);
  const positionY = parseInt(matches[2], 10);
  const velocityX = parseInt(matches[3], 10);
  const velocityY = parseInt(matches[4], 10);

  points.push({
    positionX,
    positionY,
    velocityX,
    velocityY
  })

//   console.log(`positionX: ${positionX}`);
//   console.log(`positionY: ${positionY}`);
//   console.log(`velocityX: ${velocityX}`);
//   console.log(`velocityY: ${velocityY}`);
});

rl.on("close", () => {
    let seconds = 0;
    let grid

    while (seconds < 2) {
        normalisePoints()
        grid = initialiseGrid()
        writePointsToGrid(grid)
        writeGridToFile(grid)
        movePoints()
        seconds++
    }
})

const GRID_SIZE = 22

function initialiseGrid() {
    const grid = []
    for (let x = 0; x < GRID_SIZE; x++) {
        grid[x] = []
        for (let y = 0; y < GRID_SIZE; y++) {
            grid[x][y] = '.'
        }
    }
    return grid
}

function normalisePoints() {
    let minX = 0
    let minY = 0

    points.forEach(p => {
        if (p.positionX < minX) {
            minX = p.positionX
        }
        if (p.positionY < minY) {
            minY = p.positionY
        }
    })

    points.forEach(p => {
        p.positionX -= minX
        p.positionY -= minY
    })
}

function writePointsToGrid(grid) {
    points.forEach(p => {
        grid[p.positionY][p.positionX] = '#'
    })
}

function writeGridToFile(grid) {
    fs.writeFileSync(OUTFILE, '')
    grid.forEach(line => {
        fileOutput.write(line.join(''))
        fileOutput.write('\n')
    })
}

function movePoints() {
    points.forEach(point => {
        point.positionX += point.velocityX
        point.positionY += point.velocityY
    })
}