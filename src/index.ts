const hey = [
    73,
    102,
    32,
    121,
    111,
    117,
    39,
    114,
    101,
    32,
    115,
    101,
    101,
    105,
    110,
    103,
    32,
    116,
    104,
    105,
    115,
    32,
    109,
    101,
    115,
    115,
    97,
    103,
    101,
    44,
    32,
    116,
    104,
    97,
    116,
    32,
    109,
    101,
    97,
    110,
    115,
    32,
    121,
    111,
    117,
    39,
    114,
    101,
    32,
    114,
    101,
    97,
    100,
    121,
    32,
    116,
    111,
    32,
    99,
    114,
    101,
    97,
    116,
    101,
    32,
    97,
    32,
    112,
    114,
    111,
    106,
    101,
    99,
    116,
    33
];

console.log(hey.map(x => String.fromCodePoint(x)).join(""));
