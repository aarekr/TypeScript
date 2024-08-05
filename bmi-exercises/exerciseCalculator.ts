interface Result {
    periodLength: number,
    trainingDays: number,
    success: Boolean,
    rating: number,
    ratingDescription: String,
    target: number,
    average: number
}

const checkIfTargetReached = (averageTime: number, dailyTarget: number, 
                              numberOfTrainingDays: number, numberOfDays: number): Boolean => {
    // success criteria:
    //   1) at least 5/7 days of training during period
    //   2) fails if trains less than 0.5*dailyTarget
    if(numberOfTrainingDays/numberOfDays < 5/7)
        return false;
    if(averageTime < 0.5*dailyTarget)
        return false;
    return true;
}

const giveRating = (numberOfTrainingDays: number, numberOfDays: number,
                    averageTime: number, dailyTarget: number): number => {
    let rating = 2;
    if(numberOfTrainingDays == numberOfDays)
        rating += 1
    else if(numberOfTrainingDays < 0.3*numberOfDays)
        rating -= 1
    if(averageTime > 1.5*dailyTarget)
        rating += 1
    else if(averageTime < 0.5*dailyTarget)
        rating -= 1
    if(rating < 1) return 1;
    if(rating > 3) return 3;
    return rating;
}

const calculateExercises = (taulu: number[], dailyTarget: number): Result => {
    let numberOfDays = taulu.length;
    let numberOfTrainingDays = taulu.filter(x => x > 0).length;
    let totalTime = 0;
    taulu.forEach(hours => totalTime += hours);
    let averageTime = totalTime / numberOfDays;
    let rating = giveRating(numberOfTrainingDays, numberOfDays, averageTime, dailyTarget);
    let ratingDescription = ['You should train more',
                             'not too bad but could be better',
                             'Excellent! You train a lot.'];
    let answer:Result = {
        periodLength: numberOfDays,
        trainingDays: numberOfTrainingDays,
        success: checkIfTargetReached(averageTime, dailyTarget, numberOfTrainingDays, numberOfDays),
        rating: rating,
        ratingDescription: ratingDescription[rating-1],
        target: dailyTarget,
        average: averageTime
    }
    return answer;
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));  // default
//console.log(calculateExercises([3, 0, 0, 0, 0, 3, 0], 2));  // 2 days per week
//console.log(calculateExercises([3, 2, 1, 1, 2, 4, 1], 2));  // every day
