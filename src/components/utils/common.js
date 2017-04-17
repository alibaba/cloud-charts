export const compareComputed = function (compare, value1, value2) {
  switch(compare){
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
}