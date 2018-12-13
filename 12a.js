const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input12.txt"),
  crlfDelay: Infinity
});

const rules = {};
let initialState;

rl.on("line", line => {
  let matches;
  let leftSide;
  let rightSide;

  if (line.startsWith("initial state:")) {
    initialState = line.match(/initial state: ([\.#]+)/)[1];
  } else if (line.startsWith("#") || line.startsWith(".")) {
    matches = line.match(/([\.#]{5}) => ([\.#])/);
    leftSide = matches[1];
    rightSide = matches[2];
    rules[leftSide] = rightSide;
  }
});

rl.on("close", () => {
  startBreeding(initialState);
});

function startBreeding(initialState) {
  let rowOfPots;
  let matchingRule;
  let pots = initialState;
  const generations = [pots];
  let genCount = 0;
  let indicesShift = 0;
  //   const RUNS = 20;
  const RUNS = 101;

  while (genCount < RUNS) {
    if (!pots.startsWith(".....")) {
      pots = `.....${pots}`;
      indicesShift += 5;
    }
    if (!pots.endsWith(".....")) {
      pots = `${pots}.....`;
    }

    let nextGeneration = [];
    for (let j = 0; j < pots.length; j++) {
      nextGeneration.push(".");
    }
    for (let i = 0; i < pots.length - 5; i++) {
      rowOfPots = pots.substr(i, 5);
      matchingRule = rules[rowOfPots];
      if (matchingRule) {
        nextGeneration[i + 2] = matchingRule;
      }
    }

    pots = nextGeneration.join("");
    generations.push(pots);
    genCount++;
  }
  //   console.log(generations.join("\nS"));

  const lastGen = generations[RUNS];
  let sumOfPlantIndices = 0;
  let plantCount = 0;

  for (let i = 0; i < lastGen.length; i++) {
    if (lastGen.charAt(i) === "#") {
      sumOfPlantIndices += i - indicesShift;
      plantCount++;
    }
  }

  sumOfPlantIndices += (50000000000 - 101) * plantCount;

  console.log(`after 50000000000 generations: ${sumOfPlantIndices} `);
}
