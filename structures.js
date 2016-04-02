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


module.exports = {
    tuples: tuples,
    lists: lists,
    records: records
};
