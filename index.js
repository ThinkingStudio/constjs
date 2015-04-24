"use strict";

/**
 * Constructs a constant object with string contains a group of keys separated by space,
 * or an array of String keys
 *
 * For example:
 *
 *   var COLORS = genConst("blue red green");
 *   var myColor = COLORS.blue;
 *   console.log(myColor); //output blue
 *
 * @param {string} obj
 * @return {object}
 */

function isString(v) {
  return (typeof v == 'string' || v instanceof String)
}

var genConst = function(key) {
  var ret = {};
  var keys = [];
  if (Array.isArray(key)) {
    for (var i = 0, j = key.length; i < j; ++i) {
      var k = key[i];
      if (!k || !isString(k)) {
        throw new Error("bad enum key: " + k);
      }
      keys.push(k);
    }
  } else if (key instanceof Object && !Array.isArray(key)) {
    for (k in key) {
      if (key.hasOwnProperty(k)) {
        keys.push(k)
      }
    }
  } else if (!isString(key)) {
    throw new Error('Argument must be a string or an array of strings.');
  } else {
    keys = key.split(/[,;:\s]+/);
  }

  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i];
    ret[k] = k;
  }

  return ret;
};

module.exports = genConst;