const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input13small.txt"),
  crlfDelay: Infinity
});

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
      tracks[rowNo].push(CAR_TRACKS[char]);
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
      tracks[rowNo].push(TRACK_DIRECTIONS[char]);
    } else {
      tracks[rowNo].push("");
    }
  }
  rowNo++;
});

rl.on("close", () => {
  console.log(JSON.stringify(tracks));
  console.log(JSON.stringify(cars));

  let nextPosition;

  cars.forEach(({ direction, position: { x, y }, position }) => {
    switch (direction) {
      case "RIGHT":
        nextPosition = { y, x: x + 1 };
        break;
      case "LEFT":
        nextPosition = { y, x: x - 1 };
        break;
      case "TOP":
        nextPosition = { y: y + 1, x };
        break;
      case "DOWN":
        nextPosition = { y: y - 1, x };
        break;
    }
    position.x = nextPosition.x;
    position.y = nextPosition.y;
    nextField = tracks[po];
  });
});
