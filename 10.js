const readline = require("readline");
const fs = require("fs");

OUTFILE = "output10.txt";

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

});

rl.on("close", () => {
  let seconds = 1;
  let grid;


  let prevRangeX = null;
  let prevRangeY = null;


  while (seconds < 10349) {
    movePoints();

    const { minX, minY, maxX, maxY } = findMinMax();
    rangeX = maxX - minX;
    rangeY = maxY - minY;

    // Look for the point where the range between
    // lowest and highest X becomes bigger again.
    // This is when the points start to drift apart again.
    if (prevRangeX !== null && rangeX > prevRangeX) {

        // The previous run was the one with the minimum
        // min-max distance, so this must be the solution.
        seconds--
        movePointsBackwards()

        // Normalise to remove whitespace around the points.
        normalisePoints()
        grid = initialiseGrid(findMinMax().maxX + 1, findMinMax().maxY + 1);
        writePointsToGrid(grid);
        writeGridToFile(grid);

        console.log(`Found solution at ${seconds} seconds.`);

        break
    }
    prevRangeX = rangeX
    prevRangeY = rangeY

    seconds++;
  }

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

function initialiseGrid(gridSizeX, gridSizeY) {
  const grid = [];
  for (let y = 0; y < gridSizeY; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSizeX; x++) {
      grid[y][x] = "."
    }
  }
  return grid;
}

function normalisePoints() {
  const {minX, minY} = findMinMax()

  points.forEach(p => {
    p.positionX -= minX;
    p.positionY -= minY;
  });
}

function writePointsToGrid(grid) {
  points.forEach(p => {
    grid[p.positionY][p.positionX] = "#";
  });
}

function writeGridToFile(grid) {
  fileOutput = fs.createWriteStream(OUTFILE, {
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

function movePointsBackwards() {
    points.forEach(point => {
      point.positionX -= point.velocityX;
      point.positionY -= point.velocityY;
    });
  }
