const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input9.txt"),
  crlfDelay: Infinity
});

function initPlayerScores(playerCount) {
  const playerScores = {};
  for (let i = 0; i < playerCount; i++) {
    playerScores[i + 1] = 0;
  }
  return playerScores;
}

function placeNewMarble(currentMarble, nextMarbleNumber) {
  newMarble = {
    number: nextMarbleNumber,
    rightMarble: currentMarble.rightMarble.rightMarble,
    leftMarble: currentMarble.rightMarble
  };

  // Insert newMarble between currentMarble + 1 CW and +2 CW.
  currentMarble.rightMarble.rightMarble.leftMarble = newMarble;
  currentMarble.rightMarble.rightMarble = newMarble;

  return newMarble;
}

function removeSpecialMarble(currentMarble) {
  // the marble 7 marbles counter-clockwise from the current marble is removed
  // from the circle and also added to the current player's score.

  let removedMarble =
    currentMarble.leftMarble.leftMarble.leftMarble.leftMarble.leftMarble
      .leftMarble.leftMarble;

  let leftOfRemovedMarble =
    currentMarble.leftMarble.leftMarble.leftMarble.leftMarble.leftMarble
      .leftMarble.leftMarble.leftMarble;
  let rightOfRemovedMarble =
    currentMarble.leftMarble.leftMarble.leftMarble.leftMarble.leftMarble
      .leftMarble;
  leftOfRemovedMarble.rightMarble = rightOfRemovedMarble;
  rightOfRemovedMarble.leftMarble = leftOfRemovedMarble;

  // The marble located immediately clockwise of the marble
  // that was removed becomes the new current marble.
  newCurrentMarble = rightOfRemovedMarble;

  return {
    removedMarble,
    newCurrentMarble
  };
}

function getHighScore(playerCount, lastMarblePoints) {
  let turnNumber = 0;
  let nextMarbleNumber = 1;
  const initialMarble = {
    number: 0
  };
  initialMarble.leftMarble = initialMarble;
  initialMarble.rightMarble = initialMarble;

  let currentMarble = initialMarble;
  let currentPlayer = 1;

  const playerScores = initPlayerScores(playerCount);

  while (true) {
    if (nextMarbleNumber % 23 !== 0) {
      // Normal turn, number not divisible by 23
      currentMarble = placeNewMarble(currentMarble, nextMarbleNumber);
    } else {
      // Special turn
      playerScores[currentPlayer] += nextMarbleNumber;
      const { removedMarble, newCurrentMarble } = removeSpecialMarble(
        currentMarble
      );
      playerScores[currentPlayer] += removedMarble.number;
      currentMarble = newCurrentMarble;
    }

    if (nextMarbleNumber === lastMarblePoints) {
      break;
    }
    nextMarbleNumber++;

    // player numbers are 1-indexed
    currentPlayer = (currentPlayer % playerCount) + 1;
  }

  let maxScore = 0;
  for (let player in playerScores) {
    if (playerScores[player] > maxScore) {
      maxScore = playerScores[player];
    }
  }

  return maxScore;
}

rl.on("line", line => {
  const matches = line.match(
    /(\d+) players; last marble is worth (\d+) points/
  );
  const playerCount = parseInt(matches[1], 10);
  const lastMarblePoints = parseInt(matches[2], 10);
  const firstHighScore = getHighScore(playerCount, lastMarblePoints);
  const secondHighScore = getHighScore(playerCount, lastMarblePoints * 100);
  console.log(`firstHighScore: ${firstHighScore}`);
  console.log(`secondHighScore: ${secondHighScore}`);
});
