const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input9.txt"),
  crlfDelay: Infinity
});

rl.on("line", line => {
  const matches = line.match(
    /position=<\w_(\d+),  (\d+)> velocity=< 0,  2>/
  );
  const playerCount = parseInt(matches[1], 10);
  const lastMarblePoints = parseInt(matches[2], 10);
  const firstHighScore = getHighScore(playerCount, lastMarblePoints);
  const secondHighScore = getHighScore(playerCount, lastMarblePoints * 100);
  console.log(`firstHighScore: ${firstHighScore}`);
  console.log(`secondHighScore: ${secondHighScore}`);
});
