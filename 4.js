const readline = require('readline')
const fs = require('fs')

const lineReader = readline.createInterface({
    input: fs.createReadStream('input4.txt'),
    crlfDelay: Infinity
});

let events = []

lineReader.on('line', (line) => {
    events.push(parseLine(line))
});

function parseLine(line) {
    const match = line.match(/\[(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)\] (.+)/)
    const date = new Date(match[1], match[2] - 1, match[3], match[4], match[5])
    return {
        date,
        text: match[6]
    }
}

lineReader.on('close', () => {
    let guardSleeps = {}
    let guardSleepsDuring = {}

    sortEventsByDate()
    analyseEvents(guardSleeps, guardSleepsDuring)

    const sleepiestGuard = findSleepiestGuard(guardSleeps)

    const { maxMinute, maxMinuteCount } = findMostSleptMinute(sleepiestGuard, guardSleepsDuring)

    console.log(`Sleepiest guard: ${sleepiestGuard}`) // 1049
    console.log(`Has slept most at minute: ${maxMinute}`) // 37
    console.log(`The first solution is ${sleepiestGuard * maxMinute}`) // 38813

    const { mostAsleepMinute, mostAsleepMinuteCount, mostAsleepMinuteGuard } = findGuardMostAsleepAtMinute(guardSleepsDuring)

    console.log(`Guard that is most asleep at a given minute: ${mostAsleepMinuteGuard}`) // 2879
    console.log(`He was most asleep at minute: ${mostAsleepMinute}`) // 49
    console.log(`The second solution is ${mostAsleepMinuteGuard * mostAsleepMinute}`) // 141071

})

function sortEventsByDate() {
    events.sort((a, b) => {
        if (a.date < b.date) {
            return -1
        }
        if (a.date > b.date) {
            return 1
        }
        return 0
    })
}

function analyseEvents(guardSleeps, guardSleepsDuring) {
    let activeGuard = null
    let sleepingFrom = null
    let sleepingUntil

    events.forEach(event => {
        guardNumber = event.text.match(/#(\d+)/)
        if (guardNumber) {
            activeGuard = parseInt(guardNumber[1], 10)
            return
        }
        if (event.text.match(/falls asleep/)) {
            sleepingFrom = event.date.getMinutes()
            return
        }
        if (event.text.match(/wakes up/)) {
            sleepingUntil = event.date.getMinutes()
            if (activeGuard === null) {
                throw new Error('No active guard during wakeup')
            }
            if (sleepingFrom === null) {
                throw new Error('No falling asleep before wakeup')
            }

            logSleep(activeGuard, sleepingFrom, sleepingUntil, guardSleeps, guardSleepsDuring)
            sleepingFrom = null
        }
    })
}

function logSleep(guard, sleepingFrom, sleepingUntil, guardSleeps, guardSleepsDuring) {
    if (guardSleeps.hasOwnProperty(guard)) {
        guardSleeps[guard] += sleepingUntil - sleepingFrom
    } else {
        guardSleeps[guard] = sleepingUntil - sleepingFrom
    }
    if (guardSleepsDuring.hasOwnProperty(guard)) {
        for (let i = sleepingFrom; i < sleepingUntil; i++) {
            if (guardSleepsDuring[guard].hasOwnProperty(i)) {
                guardSleepsDuring[guard][i] += 1
            } else {
                guardSleepsDuring[guard][i] = 1
            }
        }
    } else {
        guardSleepsDuring[guard] = {}
        for (let i = sleepingFrom; i < sleepingUntil; i++) {
            if (guardSleepsDuring[guard].hasOwnProperty(i)) {
                guardSleepsDuring[guard][i] += 1
            } else {
                guardSleepsDuring[guard][i] = 1
            }
        }
    }
}

function findSleepiestGuard(guardSleeps) {
    let maxSleep = 0
    let sleepiestGuard = null
    for (let guardId in guardSleeps) {
        if (guardSleeps[guardId] > maxSleep) {
            maxSleep = guardSleeps[guardId]
            sleepiestGuard = guardId
        }
    }
    return sleepiestGuard
}

function findMostSleptMinute(guard, guardSleepsDuring) {
    let maxMinuteCount = 0
    let maxMinute = null
    for (let minute in guardSleepsDuring[guard]) {
        if (guardSleepsDuring[guard][minute] > maxMinuteCount) {
            maxMinuteCount = guardSleepsDuring[guard][minute]
            maxMinute = minute
        }
    }
    return {
        maxMinute,
        maxMinuteCount
    }
}

function findGuardMostAsleepAtMinute(guardSleepsDuring) {
    let mostAsleepMinuteCount = 0
    let mostAsleepMinute
    let mostAsleepMinuteGuard

    for (let guard in guardSleepsDuring) {
        for (let minute in  guardSleepsDuring[guard]) {
            if (guardSleepsDuring[guard][minute] > mostAsleepMinuteCount) {
                mostAsleepMinuteCount = guardSleepsDuring[guard][minute]
                mostAsleepMinute = minute
                mostAsleepMinuteGuard = guard
            }
        }
    }

    return {
        mostAsleepMinute,
        mostAsleepMinuteCount,
        mostAsleepMinuteGuard
    }
}