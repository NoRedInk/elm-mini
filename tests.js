var tuples =
    [
        { ctor: "_Tuple0" },
        { ctor: '_Tuple2'
        , _0 : 1
        , _1 : "hello"
        }
    ];

var lists =
    [
        { ctor: '[]' },
        { ctor: '::',
         _0: 2,
         _1: { ctor: '[]' }
        }
    ];

var records =
    [
        { name : "noah" },
        { isSeen : true, dinosaurs: 17 }
    ];


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
    var tupleResults = singleTest(tuples, someOtherMethod);
    var listResults = singleTest(lists, someOtherMethod);
    var recordResults = singleTest(records, someOtherMethod);


    return {
        tuples: tupleResults,
        lists: listResults,
        records: recordResults
    };
};


var sum = function(collection){
    return collection.reduce(function(a, b) { return a + b; }, 0);
};

var main = function(reducer){
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
};


// This is the function to perform the minification in
// It takes an object, and should return an object
// the goal is to preserve the meaning on the object
var reducer = function(object){
    return object;
};

// inverse of reducer
var unreducer = function(object){
    return object;
};

main(reducer);
