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

var genConst = function(key) {
  var ret = {};
  var keys = [];
  if (_.isArray(key)) {
    for (var i = 0, j = key.length; i < j; ++i) {
      var k = key[i];
      if (!k || !_.isString(k)) {
        throw new Error("bad enum key: " + k);
      }
      keys.push(k);
    }
  } else if (key instanceof Object && !Array.isArray(key)) {
    for (k in key) {
      if (obj.hasOwnProperty(k)) {
        keys.push(k)
      }
    }
  } else if (!_.isString(key)) {
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