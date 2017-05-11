'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var compareComputed = exports.compareComputed = function compareComputed(compare, value1, value2) {
  switch (compare) {
    case '<':
      return value1 < value2;
    case '<=':
      return value1 <= value2;
    case '>':
      return value1 > value2;
    case '>=':
      return value1 >= value2;
    case '==':
      return value1 == value2;
    case '===':
      return value1 === value2;
    case '!=':
      return value1 != value2;
    case '!==':
      return value1 !== value2;
    default:
      return false;
  }
};