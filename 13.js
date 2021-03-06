const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input13.txt"),
  crlfDelay: Infinity
});

const fileOutput = fs.createWriteStream('output13.txt', {
  flags: 'w' 
})

const tracks = [];
const initialTracks = []
let cars = [];
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

function getCarForChar(char) {
  if (char === '^' || char ===  'v') {
    return '|'
  }
  return '-'
}

rl.on("line", line => {
  tracks.push([]);
  initialTracks.push([])
  for (let i = 0; i < line.length; i++) {
    char = line.charAt(i);
    if (CAR_SYMBOLS.includes(char)) {
      tracks[rowNo].push(char);
      initialTracks[rowNo].push(getCarForChar(char))
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
      tracks[rowNo].push(char);
      initialTracks[rowNo].push(char)
    } else {
      tracks[rowNo].push(" ");
      initialTracks[rowNo].push(" ")
    }
  }
  rowNo++;
});

rl.on("close", () => {
  let nextPosition;
  let ticks = 0
  let crashed = false
  let crashedCars = []
  let uncrashedCars = cars
  let lastRound = false

  while (uncrashedCars.length > 1) {
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
      if (car.crashed) {
        return
      }

      const { direction, position: { x,y }, position, id } = car 
      const nextPosition = getNextPosition(direction, position, car)

      tracks[y][x] = initialTracks[y][x]
      
      position.x = nextPosition.x;
      position.y = nextPosition.y;

      let nextTrack = getNextTrack(car)

      if (nextTrack === 'X') {
        crashed = true
        console.log(`Crash at ${JSON.stringify(position)}`)
        
        car.crashed = true
        setOtherCarToCrashed(position)

        // clean up the crash and return to initial state
        tracks[nextPosition.y][nextPosition.x] = initialTracks[nextPosition.y][nextPosition.x]
        return
      }

      car.direction = CAR_DIRECTIONS[nextTrack]
      tracks[nextPosition.y][nextPosition.x] = nextTrack
      
    });
    ticks++
    writeTracks(ticks)

    crashedCars = cars.filter(car => car.crashed)
    uncrashedCars = cars.filter(car => !car.crashed)

    if (uncrashedCars.length === 1) {
      // only one uncrashed car left
      console.log(`last car's position: ${JSON.stringify(uncrashedCars[0])}`)
    }
  }

});

function setOtherCarToCrashed(position) {
  const crashedInto = cars.find(car =>
    !car.crashed && car.position.x === position.x && car.position.y === position.y)
  
  crashedInto.crashed = true

}

function writeTracks(ticks) {
  fileOutput.write(`After tick ${ticks}:\n`)
  tracks.forEach(row => {
    fileOutput.write(row.join(''))
    fileOutput.write('\n')
  })
}

function getNextTrack(car) {
  const { direction, position, nextTurn } = car
  const currentField = tracks[position.y][position.x]
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
  console.log(`no next turn for ${JSON.stringify(car)}, currentField: ${currentField}`)
}

function getNextPosition(direction, position, car) {
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
      console.log(`No direction given for ${direction}, Car ${JSON.stringify(car)} `)
  }
}