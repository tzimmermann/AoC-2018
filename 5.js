const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input5.txt"),
  crlfDelay: Infinity
});

rl.on("line", line => {
  let trimmedLine;

  const LETTERS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];

  const fullResult = performReactions(line);

  let minResultLength = Number.MAX_SAFE_INTEGER;
  LETTERS.forEach(letter => {
    trimmedLine = line.replace(new RegExp(letter, "gi"), "");
    result = performReactions(trimmedLine);
    if (result.length < minResultLength) {
      minResultLength = result.length;
    }
  });

  console.log(`Remaining units after reaction: ${fullResult.length}`);
  console.log(
    `Minimal polymer length after removing one type: ${minResultLength}`
  );
});

function performReactions(line) {
  let myLine = line;
  for (let i = 0; i < myLine.length - 1; i++) {
    currentLetterCode = myLine.charCodeAt(i);
    nextLetterCode = myLine.charCodeAt(i + 1);

    // If the code point difference is 32, one has to be the upper case
    // and the other the lower case letter.
    if (Math.abs(currentLetterCode - nextLetterCode) === 32) {
      myLine = myLine.substring(0, i) + myLine.substring(i + 2);
      i -= 2;
    }
  }
  return myLine;
}
