const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input8.txt"),
  crlfDelay: Infinity
});

let childNodeCount;
let metaDataCount;
let currentIndex = 0;
let metaDataSum = 0;

function parseNode(numbers) {
  const childNodeCount = numbers[currentIndex];
  currentIndex++;

  const metaDataCount = numbers[currentIndex];
  currentIndex++;

  let childNodes = [];
  let metaData = [];
  for (let i = 0; i < childNodeCount; i++) {
    childNodes.push(parseNode(numbers));
  }
  for (let j = 0; j < metaDataCount; j++) {
    const singleMetaData = numbers[currentIndex];
    metaData.push(singleMetaData);
    metaDataSum += singleMetaData;
    currentIndex++;
  }

  return {
    childNodeCount,
    metaDataCount,
    childNodes,
    metaData
  };
}

function computeValue(node) {
  if (node.childNodeCount === 0) {
    // No child nodes -> just sum up all metadata
    return node.metaData.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
  }

  let valueFromChildren = 0;
  node.metaData.forEach(metaData => {
    const childIndex = metaData - 1;
    if (childIndex < node.childNodeCount) {
      valueFromChildren += computeValue(node.childNodes[childIndex]);
    }
  });
  return valueFromChildren;
}

rl.on("line", line => {
  const splits = line.split(" ");
  const numbers = splits.map(s => parseInt(s, 10));
  const tree = parseNode(numbers);
  console.log(`Sum of all metadata: ${metaDataSum}`);
  const rootValue = computeValue(tree);
  console.log(`value of root node: ${rootValue}`);
});
