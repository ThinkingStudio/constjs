'use strict';

var _ = require('lodash');


function isArray(v) {
  return _.isArray(v);
}

function isObject(v) {
  return v instanceof Object && !isArray(v);
}

function isString(v) {
  return _.isString(v);
}

function ensureValidEnumKeyName(nm) {
  if(!nm || (typeof nm !== 'string') || !isNaN(parseInt(nm))) {
    throw 'bad enum key: ' + nm;
  }
}

function keysFromArray(array) {
  var a = [];
  for (var i = 0, j = array.length; i < j; ++i) {
    var k = array[i];
    var a1 = keysFromString(k);
    a = a.concat(a1);
  }
  return a;
}

function keysFromObject(obj) {
  var a = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      ensureValidEnumKeyName(k);
      a.push(k);
    }
  }
  return a;
}

function keysFromString(s) {
  var a = s.split(/[,;:\s]+/);
  for (var i = 0, j = a.length; i < j; ++i) {
    ensureValidEnumKeyName(a[i]);
  }
  return a;
}

function getIsFuncName(k) {
  ensureValidEnumKeyName(k);
  return 'is' + _.capitalize(_.camelCase(k));
}

function buildEnum(keys, theEnum, serializable) {
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i], en = {_id: k, _seq: i};
    theEnum[k] = en;
    extendIsFuncsToEnumItem(en, keys, serializable);
  }
}

function extendIsFuncsToEnumItem(en, keys, serializable) {
  en.toString = function() {return en._id;};
  en.name = en.toString;
  if (keys && serializable) {
    en._kl = keys;
  }
  if (keys) {
    _.forEach(keys, function(key) {
      var fn = getIsFuncName(key);
      en[fn] = function() {
        return key === en._id;
      };
    });
  }
  en.is = function(v) {
    if (v === en) return true;
    if (v === null || typeof v === 'undefined' || v === false) return false;
    if (v === en._seq) return true;
    if (v._id) {
      return v._id === en._id;
    }
    if (typeof v === 'string') {
      return v.toUpperCase() === en._id.toUpperCase();
    }
    return false;
  };
}

function freeze(o) {
  if (Object && Object.freeze) {
    return Object.freeze(o);
  } else {
    return o;
  }
}

function seal(o) {
  if (Object && Object.seal) {
    return Object.seal(o); 
  } else {
    return o;
  }
}

var genEnum = function(key) {
  var keys = [];
  if (arguments.length > 1) {
    keys = keysFromArray(arguments);
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theEnum = {};
  buildEnum(keys, theEnum, true);

  return freeze(theEnum);
};

genEnum.transient = function(key) {
  var keys = [];
  if (arguments.length > 1) {
    keys = keysFromArray(arguments);
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theEnum = {};
  buildEnum(keys, theEnum, false);

  return freeze(theEnum);
};

genEnum.lite = genEnum.transient;

var genConst = function(key) {
  var keys = [];
  if (arguments.length > 1) {
    keys = keysFromArray(arguments);
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theConst = {};
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i];
    theConst[k] = k;
  }

  return freeze(theConst);
};

var _genBitmap = function(key) {
  var keys = [], defVal = false, theObj = false;
  if (arguments.length > 1) {
    if (typeof arguments[0] === 'boolean') {
      defVal = arguments[0];
      var args = [];
      Array.prototype.push.apply(args, arguments);
      args.shift();
      if (args.length == 1) {
        key = args[0];
        if (isString(key)) {
          keys = keysFromString(key);
        } else if (isObject(key)) {
          theObj = key;
          keys = keysFromObject(key);
        } else if (isArray(key)) {
          keys = keysFromArray(key);
        } else {
          throw new Error('Argument must be a string or an array of strings.');
        }
      } else {
        keys = keysFromArray(args);
      }
    } else {
      keys = keysFromArray(arguments);
    }
  } else if (isArray(key)) {
    keys = keysFromArray(key);
  } else if (isObject(key)) {
    theObj = key;
    keys = keysFromObject(key);
  } else if (isString(key)) {
    keys = keysFromString(key);
  } else {
    throw new Error('Argument must be a string or an array of strings.');
  }

  var theBitmap = {};
  for (var i = 0, j = keys.length; i < j; ++i) {
    var k = keys[i];
    if (theObj && typeof theObj[k] === 'boolean') {
      theBitmap[k] = theObj[k]; 
    } else {
      theBitmap[k] = defVal;
    }
  }

  return theBitmap;
};

var genBitmap = function(key) {
  var theBitmap = _genBitmap.apply(this, arguments);
  return seal(theBitmap);
};

genBitmap.immutable = function(key) {
  return freeze(_genBitmap.apply(this, arguments));
};

var _unJSON = function(v) {
  if (v && v._id) {
    extendIsFuncsToEnumItem(v, v._kl, true);
  } else if (isObject(v)) {
    for (var k in v) {
      if (v.hasOwnProperty(k)) {
        _unJSON(v[k]);
      }
    }
  }
};

var unJSON = function(v) {
  if (typeof(v) === 'string') {
    v = JSON.parse(v);
  }
  _unJSON(v);
  return v;
};

module.exports = {
  enum: genEnum,
  const: genConst,
  bitmap: genBitmap,
  unJSON: unJSON
};