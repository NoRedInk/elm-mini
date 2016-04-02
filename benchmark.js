var structures = require('./structures');
var fs = require('fs');


var minify = function(someObj){
    return JSON.stringify(someObj);
};

var smallerSizes = function(first, second){
    return {
        first: minify(first).length,
        second: minify(second).length
    };
};

var singleTest = function(collection, someOtherMethod){
    var results = [];

    collection.forEach(function(item){
        var sizes = smallerSizes(item, someOtherMethod(item));

        results.push(sizes.first - sizes.second);
    });

    return results;
};

var tests = function(someOtherMethod){
    var output = {};

    Object.keys(structures).forEach(function(key){
        output[key] = singleTest(structures[key], someOtherMethod);
    });

    return output;
};


var sum = function(collection){
    return collection.reduce(function(a, b) { return a + b; }, 0);
};

var writeResult = function(filename, amountRun, total, reducer){
    var shortn = JSON.stringify(reducer.toString());

    fs.appendFileSync(filename, `${amountRun} | ${total}\n`);
    fs.appendFileSync(filename + "code", shortn);
};

var partBreakdown = function(row){
    var parts = row.split('|');

    return {
        amount: parseInt(parts[0]),
        total: parseInt(parts[1])
    };
};

var mostTested = function(rows){
    var most = -1;
    var current = -1;

    rows.forEach(function(row, index){
        if (row.amount > current){
            most = index;
        }
    });

    return most;
};

var mostSuccessful = function(rows){
    var most = -1;
    var current = 99999;

    rows.forEach(function(row, index){
        if (row.total < current){
            most = index;
        }
    });

    return most;
};

var bestRatio = function(rows){
    var most = -1;
    var currentRatio = null;

    rows.forEach(function(row, index){
        var myRatio = row.amount / row.total;

        if (currentRatio === null || myRatio < currentRatio){
            most = index;
            currentRatio = myRatio;
        }
    });

    return most;
};

var historyBreakdown = function(data, current){
    var rows =
        data.trim()
            .split('\n')
            .map(partBreakdown);

    var mostTestedIndex = mostTested(rows);
    var howManyMoreTests = rows[mostTestedIndex].amount - current.amount;

    var mostSuccessfulIndex = mostSuccessful(rows);
    var howManyMoreSuccessful = rows[mostSuccessfulIndex].total - current.total;

    var bestRatioIndex = bestRatio(rows);

    var firstRatio = rows[bestRatioIndex].amount / rows[bestRatioIndex].total;
    var secondRatio = current.amount / current.total;

    console.log("History breakdown");
    console.log("--------------------------");


    console.log(`Most tested was build ${mostTestedIndex}`);
    console.log(`It had ${howManyMoreTests} more tests`);
    console.log("--------------------------");

    console.log(`Most reduced characters of all time was build ${mostSuccessfulIndex}`);
    console.log(`It saved ${howManyMoreSuccessful} more characters`);
    console.log("--------------------------");

    console.log(`The build with the best ratio was ${mostTestedIndex}`);
    console.log(`It a ratio of ${firstRatio}, while the current build has ${secondRatio}`);


    if (secondRatio <= firstRatio){
        console.log("Yay! you're winng");
    }

};

var main = function(saveToFile, reducer){
    var results = tests(reducer);
    var groups = Object.keys(results);
    var amountRun = sum(groups.map(function(key){
        return results[key].length;
    }));

    var total = sum(groups.map(function(key){
        return sum(results[key]);
    }));

    console.log(amountRun + " tests were run.");

    if (total >= 0){
        console.log("A total of " + total + " characters were saved! :D");
    } else {
        console.log("A total of " + Math.abs(total) + " characters were added! :(");
    }

    console.log("--------------------------");
    console.log("Here's the breakdown:");
    console.log("--------------------------");


    groups.forEach(function(group){
        console.log(group + " had " + results[group].length + " tests.");
        console.log("The overall saving was " + sum(results[group]));
        console.log(results[group]);
        console.log("--------------------------");
    });

    if (saveToFile) {
        writeResult('marks', amountRun, total, reducer);

        var data = fs.readFileSync('marks', 'utf8');

        historyBreakdown(data, {
            amount:amountRun,
            total: total,
            code: reducer.toString()
        })
    }
};


module.exports = {
    main: main
};
