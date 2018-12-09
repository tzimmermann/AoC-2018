const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: fs.createReadStream("input7.txt"),
  crlfDelay: Infinity
});

let dependingOn = {};
let taskTimes = {};

let allTasks = [];

rl.on("line", line => {
  let matches = line.match(
    /Step (\w) must be finished before step (\w) can begin\./
  );
  if (matches) {
    let dependency = matches[1];
    let dependant = matches[2];
    if (dependingOn.hasOwnProperty(dependant)) {
      dependingOn[dependant].push(dependency);
    } else {
      dependingOn[dependant] = [dependency];
    }
    if (!allTasks.includes(dependency)) {
      allTasks.push(dependency);
    }
    if (!allTasks.includes(dependant)) {
      allTasks.push(dependant);
    }
  }
});

function fillInIndependentTasks() {
  allTasks.forEach(dep => {
    // all tasks that only appear as a dependency of antoher taks
    // need to be added to the map as well (without any dependencies).
    if (!dependingOn.hasOwnProperty(dep)) {
      dependingOn[dep] = [];
    }
  });
}

function fillInTaskTimes() {
  allTasks.forEach(task => {
    taskTimes[task] = task.charCodeAt(0) - 4;
  });
}

function findAvailableWorkers(workersWorkingOn) {
  return workersWorkingOn.filter(worker => {
    return worker.task === null;
  });
}

function assignTaskToWorker(task, worker) {
  worker.task = task;
  worker.timeLeft = taskTimes[task];
}

function logWork(workersWorkingOn) {
  const doneTasks = [];
  workersWorkingOn.forEach(worker => {
    if (worker.task !== null) {
      worker.timeLeft--;
      if (worker.timeLeft === 0) {
        doneTasks.push(worker.task);
        worker.task = null;
      }
    }
  });

  return doneTasks;
}

function removeDoneTasks(doneTasks) {
  doneTasks.forEach(task => {
    delete dependingOn[task];
    for (let dependant in dependingOn) {
      dependingOn[dependant] = dependingOn[dependant].filter(
        dep => dep !== task
      );
    }
  });
}

function isBeingWorkedOn(task, workersWorkingOn) {
  return workersWorkingOn.some(worker => {
    return worker.task === task;
  });
}

function printWorkers(workersWorkingOn) {
  let result = "";
  workersWorkingOn.forEach(worker => {
    result += worker.task || ".";
    result += "\t";
  });
  return result;
}

const WORKER_COUNT = 5;

function initialiseWorkers() {
  const workers = [];
  for (let i = 0; i < WORKER_COUNT; i++) {
    workers.push({
      id: i + 1,
      task: null,
      timeLeft: null
    });
  }
  return workers;
}

function getExecutionOrder() {
  let readyForExecution = [];
  let seconds = 0;
  let availableWorkers;
  let doneTasks = [];
  let workersWorkingOn = initialiseWorkers();
  console.log("Second \tWorker 1\tDone");

  while (Object.keys(dependingOn).length > 0) {
    // Subtract One from all workers.timeLeft
    // and check for done tasks
    let newlyDoneTasks = logWork(workersWorkingOn);
    removeDoneTasks(newlyDoneTasks);
    doneTasks = doneTasks.concat(newlyDoneTasks);

    for (let dependant in dependingOn) {
      if (
        dependingOn[dependant].length === 0 &&
        !isBeingWorkedOn(dependant, workersWorkingOn)
      ) {
        if (!readyForExecution.includes(dependant)) {
          readyForExecution.push(dependant);
        }
      }
    }
    readyForExecution.sort();
    availableWorkers = findAvailableWorkers(workersWorkingOn);
    availableWorkers.forEach(worker => {
      if (readyForExecution.length > 0) {
        let runTask = readyForExecution.shift();
        assignTaskToWorker(runTask, worker);
      }
    });

    console.log(
      `${seconds}\t${printWorkers(workersWorkingOn)}\t${doneTasks.join("")}`
    );
    seconds++;
  }
  console.log(`seconds: ${seconds - 1}`);
  return doneTasks;
}

rl.on("close", () => {
  fillInIndependentTasks();
  fillInTaskTimes();
  const executionOrder = getExecutionOrder();
  console.log(executionOrder.join(""));
});
