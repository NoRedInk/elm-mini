var main = require('./benchmark').main;

var isTuple = function(object){
    return object.ctor.indexOf('_Tuple') == 0;
};

var isList = function(object){
    return object.ctor === "[]" || object.ctor === "::";
};

var isRecord = function(object){
    return (!('ctor' in object));
};




// This is the function to perform the minification in
// It takes an object, and should return an object
// the goal is to preserve the meaning on the object
var reducer = function(object){
    var reduceList = function(object){
        var list = [];

        while (object['ctor'] !== '[]') {
            list.push(object['_0']);
            object = object['_1'];
        }

        return list;
    };

    var reduceUnion = function(object){
        var fields = [];

        Object.keys(object).forEach(function(key){
            if (key === 'ctor') { return; }

            var i = parseInt(key.slice(1));
            fields[i] = object[key];
        });

        var reduced = {};
        reduced["_t"] = fields;
        return reduced;
    };


    if (isRecord(object)) {
        return object;
    }

    if (isList(object)) {
        return reduceList(object);
    }

    if (isTuple(object)){
        return reduceUnion(object);
    }

    return object;
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



main(true, reducer);
