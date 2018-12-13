const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input13small.txt"),
  crlfDelay: Infinity
});

const fileOutput = fs.createWriteStream('output13small.txt', {
  flags: 'w' 
})

const tracks = [];
const cars = [];
let char;
let rowNo = 0;

const TRACK_DIRECTIONS = {
  "|": "STRAIGHT_VERTICAL",
  "-": "STRAIGHT_HORIZONTAL",
  "/": "CURVE_TOP_LEFT",
  "\\": "CURVE_TOP_RIGHT",
  "+": "INTERSECTION"
};

const TRACK_SYMBOLS = ["|", "-", "/", "\\", "+"];

const CAR_TRACKS = {
  "^": "STRAIGHT_VERTICAL",
  v: "STRAIGHT_VERTICAL",
  "<": "STRAIGHT_HORIZONTAL",
  ">": "STRAIGHT_HORIZONTAL"
};

const CAR_DIRECTIONS = {
  "^": "UP",
  v: "DOWN",
  "<": "LEFT",
  ">": "RIGHT"
};

const CAR_SYMBOLS = ["^", "v", "<", ">"];
let carId = 0;

const CAR_TURN_ORDER = ["LEFT", "STRAIGHT", "RIGHT"];

rl.on("line", line => {
  tracks.push([]);
  for (let i = 0; i < line.length; i++) {
    char = line.charAt(i);
    if (CAR_SYMBOLS.includes(char)) {
      tracks[rowNo].push({
        current: char,
        previous: getStraight(char)
      });
      cars.push({
        id: carId++,
        position: {
          x: i,
          y: rowNo
        },
        direction: CAR_DIRECTIONS[char],
        nextTurn: CAR_TURN_ORDER[0]
      });
    } else if (TRACK_SYMBOLS.includes(char)) {
      tracks[rowNo].push({
        current: char,
        previous: null
      });
    } else {
      tracks[rowNo].push({
        current:" ",
        previous: null
      });
    }
  }
  rowNo++;
});

rl.on("close", () => {
  // console.log(JSON.stringify(tracks));
  // console.log(JSON.stringify(cars));

  let nextPosition;
  let ticks = 0
  let crashed = false

  while (!crashed) {
    cars.sort((a, b) => {
      if (a.position.y < b.position.y) {
        return -1
      }
      if (a.position.y > b.position.y) {
        return 1
      }
      return a.position.x - b.position.x
    })
    cars.forEach((car) => {
      if (crashed) {
        return
      }
      const { direction, position: { x,y }, position } = car 
      const nextPosition = getNextPosition(direction, position)
      
      tracks[y][x] = {
        current: tracks[y][x].previous,
        previous: null
      }
      
      position.x = nextPosition.x;
      position.y = nextPosition.y;

      let nextTrack = getNextTrack(car)

      if (nextTrack === 'X') {
        crashed = true
        console.log(`First Crash at ${JSON.stringify(position)}`)
        nextTrack = tracks[y][x].current
      }

      car.direction = CAR_DIRECTIONS[nextTrack]

      tracks[nextPosition.y][nextPosition.x] = {
        current: nextTrack,
        previous: tracks[nextPosition.y][nextPosition.x].current
      }
    });
    ticks++
    writeTracks(ticks)
  }

});

function writeTracks(ticks) {
  fileOutput.write(`After tick ${ticks}:\n`)
  tracks.forEach(row => {
    // console.log(JSON.stringify(row))
    fileOutput.write(row.map(r => r.current).join(''))
    fileOutput.write('\n')
  })
}

function getNextTrack(car) {
  const { direction, position, nextTurn } = car
  const currentField = tracks[position.y][position.x].current
  if (CAR_SYMBOLS.includes(currentField)) {
    return 'X'
  }
  if (currentField === '|') {
    // direction does not change
    return direction === 'UP' ? '^' : 'v'
  }
  if (currentField === '-') {
    // direction does not change
    return direction === 'LEFT' ? '<' : '>'
  }
  if (currentField === '/') {
    if (direction === 'UP') {
      return '>'
    }
    if (direction === 'DOWN') {
      return '<'
    }
    if (direction === 'LEFT') {
      return 'v'
    }
    if (direction === 'RIGHT') {
      return '^'
    }
  }
  if (currentField === '\\') {
    if (direction === 'UP') {
      return '<'
    }
    if (direction === 'DOWN') {
      return '>'
    }
    if (direction === 'LEFT') {
      return '^'
    }
    if (direction === 'RIGHT') {
      return 'v'
    }
  }
  if (currentField === '+') {
    car.nextTurn= CAR_TURN_ORDER[(CAR_TURN_ORDER.indexOf(car.nextTurn) + 1) % CAR_TURN_ORDER.length]
    // console.log(`changed nextTurn to ${car.nextTurn}`)
    if (nextTurn === 'LEFT') {
      if (direction === 'UP') {
        return '<'
      }
      if (direction === 'DOWN') {
        return '>'
      }
      if (direction === 'LEFT') {
        return 'v'
      }
      if (direction === 'RIGHT') {
        return '^'
      }
    }
    if (nextTurn === 'RIGHT') {
      if (direction === 'UP') {
        return '>'
      }
      if (direction === 'DOWN') {
        return '<'
      }
      if (direction === 'LEFT') {
        return '^'
      }
      if (direction === 'RIGHT') {
        return 'v'
      }
    }
    if (nextTurn === 'STRAIGHT') {
      if (direction === 'UP') {
        return '^'
      }
      if (direction === 'DOWN') {
        return 'v'
      }
      if (direction === 'LEFT') {
        return '<'
      }
      if (direction === 'RIGHT') {
        return '>'
      }
    }
  }
}

function getStraight(carSymbol) {
  if (['>', '<'].includes(carSymbol)) {
    return '-'
  } 
  return '|'
}

function getNextPosition(direction, position) {
  const { x, y } = position
  switch (direction) {
    case "RIGHT":
      return { y, x: x + 1 };
    case "LEFT":
      return { y, x: x - 1 };
    case "UP":
      return { y: y - 1, x };
    case "DOWN":
      return { y: y + 1, x };
    default:
      console.log(`No direction given for ${direction}, ${JSON.stringify(position)} `)
  }
}