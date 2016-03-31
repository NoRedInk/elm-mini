if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

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
        },
        { ctor: '::',
        _0: 1,
        _1: {ctor: '::',
            _0: 2,
            _1: {ctor: '[]'}
            }
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
var reducer = function(data){
    var object = Object.assign({}, data);
    if (object['ctor']) {
      if ((object['ctor']).charAt(0) === '_') {
        // tuple
        delete object['ctor'];
        var data = [];
        Object.keys(object).forEach(function(key) {
          var i = parseInt(key.slice(1));
          data[i] = object[key];
        });
        var reduced = {};
        reduced["_t"] = data;
        return reduced;
      } else {
        // list
        var list = [];
        var item = object;
        while (item['ctor'] !== '[]') {
          list.push(item['_0']);
          item = item['_1'];
        }
        return list;
      }
    } else {
      // record
      return object;
    }
};

// inverse of reducer
// tuple: {_t: []}, list: [], record: {}
var unreducer = function(object){
    if (Array.isArray(object)) {
      // list
      var list = {};
      var current = list;
      var i = 0;
      while (i < object.length) {
        current['ctor'] = "::";
        current['_0'] = object[i];
        current['_1'] = {};
        current = current['_1'];
        i++;
      }
      current['ctor'] = "[]";
      return list;
    } else {
      var keys = Object.keys(object);
      if (keys.length === 1) {
        if (keys[0] === "_t") {
          // tuple
          var tuple = {};
          var ctor = '_Tuple' + keys.length;
          tuple['ctor'] = ctor;
          object['_t'].forEach(function(item, i) {
            var key = '_' + i;
            tuple[key] = item;
          });
          return tuple;
        } else {
          // record
          return object;
        }
      } else {
        // record
        return object;
      }
    }

};

main(reducer);
// lists.forEach(function(list) {
//   console.log(unreducer(reducer(list)));
// });
