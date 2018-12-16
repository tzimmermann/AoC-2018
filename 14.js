const INPUT = 890691
// const INPUT = 59414
const NUMBER_OF_RECIPES_TO_SCORE = INPUT

let recipes = [3, 7]
let elf1currentIndex = 0
let elf2currentIndex = 1

task1()

// reset global state
recipes = [3, 7]
elf1currentIndex = 0
elf2currentIndex = 1

task2()


function task1() {
    while (recipes.length < NUMBER_OF_RECIPES_TO_SCORE + 10) {
        appendNewRecipes()
        elf1currentIndex = pickNewCurrentRecipe(elf1currentIndex)
        elf2currentIndex = pickNewCurrentRecipe(elf2currentIndex)
    }

    let scores = []
    for (let i = NUMBER_OF_RECIPES_TO_SCORE; i < NUMBER_OF_RECIPES_TO_SCORE +10; i++) {
        scores.push(recipes[i])
    }
    console.log(`final score after ${NUMBER_OF_RECIPES_TO_SCORE}: ${JSON.stringify(scores.join(''))}`)
}

function task2() {
    let matchFoundAtVeryEnd = false
    let matchFoundAtEndMinusOne = false
    let targetString = String(INPUT)
    let targetList = []
    for (i = 0; i < targetString.length; i++) {
        targetList.push(parseInt(targetString.charAt(i), 10))
    }
    while (!matchFoundAtVeryEnd && !matchFoundAtEndMinusOne) {
        appendNewRecipes()
        elf1currentIndex = pickNewCurrentRecipe(elf1currentIndex)
        elf2currentIndex = pickNewCurrentRecipe(elf2currentIndex)
        matchFoundAtVeryEnd = isSequenceAppearingAtEnd(targetList)
        matchFoundAtEndMinusOne = isSequenceAppearingAtEndMinusOne(targetList)
        if (matchFoundAtVeryEnd) {
            console.log(`# recipes to the left of ${targetList.join('')}: ${recipes.length - targetList.length}`)
        } else if(matchFoundAtEndMinusOne) {
            console.log(`# recipes to the left of ${targetList.join('')}: ${recipes.length - targetList.length - 1}`)
        }
    }
}

function pickNewCurrentRecipe(currentRecipeIndex) {
    const currentRecipeScore = recipes[currentRecipeIndex]
    return (currentRecipeIndex + currentRecipeScore + 1) % recipes.length 
}

function appendNewRecipes() {
    const sumOfRecipes = recipes[elf1currentIndex] + recipes[elf2currentIndex]
    if (sumOfRecipes >= 10) {
        recipes.push(1)
    }
    recipes.push(sumOfRecipes % 10)
}

function isSequenceAppearingAtEndMinusOne(targetSequence) {
    if (recipes.length >= targetSequence.length) {
        const secondLastNRecipes = recipes.slice(recipes.length - targetSequence.length -1, -1)
        return areArraysEqual(secondLastNRecipes, targetSequence)
    }
    return false
}

function isSequenceAppearingAtEnd(targetSequence) {
    if (recipes.length >= targetSequence.length) {
        const lastNrecipes = recipes.slice(-targetSequence.length)
        return areArraysEqual(lastNrecipes, targetSequence)
    }
    return false
}

function areArraysEqual(firstArray, secondArray) {
    if (firstArray.length === secondArray.length) {
        return firstArray.every((a, i) => 
            a === secondArray[i]
        );
    }
    return false
}