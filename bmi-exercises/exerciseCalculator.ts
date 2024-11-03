interface Result {
    periodLength: number,
    trainingDays: number,
    success: Boolean,
    rating: number,
    ratingDescription: String,
    target: number,
    average: number
}

const parseArgumentsEC = (args: string[]) => {
    if (args.length < 10)
        throw new Error('Not enough arguments. At least 1 week\'s data is required.');

    let target = 0;
    let values: number[] = [];
    for (let i=2; i<args.length; i++) {
        if (isNaN(Number(args[i]))) {
            throw new Error('Provided values were not numbers!');
        }
        if (i == 2) target = Number(args[i]);
        else values.push(Number(args[i]));
    }
    return {
        values: values,
        target: Number(target)
    }
}

const checkIfTargetReached = (averageTime: number, dailyTarget: number, 
                              numberOfTrainingDays: number, numberOfDays: number): Boolean => {
    // success criteria:
    // 1) at least 5/7 days of training during period
    // 2) fails if trains less than 0.5*dailyTarget
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
    else if(numberOfTrainingDays < 0.5*numberOfDays)
        rating -= 1
    if(averageTime > 1.2*dailyTarget)
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
    const ratingDescription = ['You should train more',
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

try{
    const { values, target } = parseArgumentsEC(process.argv);
    console.log(calculateExercises(values, target));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.'
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}
