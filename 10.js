const readline = require("readline");
const fs = require("fs");

OUTFILE = "output10";

const rl = readline.createInterface({
  input: fs.createReadStream("input10.txt"),
  crlfDelay: Infinity
});

let fileOutput;

const points = [];
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
  });

  //   console.log(`positionX: ${positionX}`);
  //   console.log(`positionY: ${positionY}`);
  //   console.log(`velocityX: ${velocityX}`);
  //   console.log(`velocityY: ${velocityY}`);
});

rl.on("close", () => {
  let seconds = 0;
  let grid;

  //   normalisePoints();

  let prevRangeX = null;
  let prevRangeY = null;

  while (seconds < 10346) {
    // grid = initialiseGrid();
    // writePointsToGrid(grid);
    // writeGridToFile(grid, seconds);
    movePoints();
    const { minX, minY, maxX, maxY } = findMinMax();
    rangeX = maxX - minX;
    rangeY = maxY - minY;

    if (prevRangeX !== null) {
      if (rangeX > prevRangeX) {
        console.log(`broke ${seconds} range: ${rangeX}`);
        break;
      }
    }
    prevRangeX = rangeX;
    prevRangeY = rangeY;
    seconds++;
  }

  console.log(`range: ${rangeX}, ${rangeY}`);
  console.log(`minY: ${minY}`);
  console.log(`maxY: ${maxY}`);
  console.log(`minX: ${minX}`);
  console.log(`maxX: ${maxX}`);

  grid = initialiseGrid(Math.max(rangeX, rangeY) + 10);
  writePointsToGrid(grid);
  writeGridToFile(grid);
});

function findMinMax() {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = 0;
  let maxY = 0;
  points.forEach(p => {
    if (p.positionX < minX) {
      minX = p.positionX;
    }
    if (p.positionX > maxX) {
      maxX = p.positionX;
    }
    if (p.positionY < minY) {
      minY = p.positionY;
    }
    if (p.positionY > maxY) {
      maxY = p.positionY;
    }
  });
  return {
    minX,
    minY,
    maxX,
    maxY
  };
}

function initialiseGrid(gridSize) {
  const grid = [];
  for (let x = 0; x < gridSize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridSize; y++) {
      grid[x][y] = ".";
    }
  }
  return grid;
}

function normalisePoints() {
  let minX = 0;
  let minY = 0;

  points.forEach(p => {
    if (p.positionX < minX) {
      minX = p.positionX;
    }
    if (p.positionY < minY) {
      minY = p.positionY;
    }
  });

  points.forEach(p => {
    p.positionX -= minX;
    p.positionY -= minY;
    console.log(`new pos: ${p.positionX},${p.positionY}`);
  });
}

function writePointsToGrid(grid) {
  points.forEach(p => {
    grid[p.positionY][p.positionX] = "#";
  });
}

function writeGridToFile(grid) {
  fileOutput = fs.createWriteStream(`${OUTFILE}`, {
    flags: "w"
  });
  grid.forEach(line => {
    fileOutput.write(line.join(""));
    fileOutput.write("\n");
  });
}

function movePoints() {
  points.forEach(point => {
    point.positionX += point.velocityX;
    point.positionY += point.velocityY;
  });
}
