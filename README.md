constjs
========

Create an const/enum/bitmap object with key names specified in String or object

## Usage


`npm install constjs`


### Enum (Java style)

```javascript
var ConstJs = require('constjs');

var Colors = ConstJs.enum("blue red");

var myColor = Colors.blue;

console.log(myColor.isBlue()); // output true
console.log(myColor.is('blue')); // output true
console.log(myColor.is('BLUE')); // output true
console.log(myColor.is(0)); // output true
console.log(myColor.is(Colors.blue)); // output true

console.log(myColor.isRed()); // output false
console.log(myColor.is('red')); // output false

console.log(myColor._id); // output blue
console.log(myColor.name()); // output blue
console.log(myColor.toString()); // output blue

// See how CamelCase is used to generate the isXxx() functions
var AppMode = ConstJs.enum('SIGN_UP, LOG_IN, FORGOT_PASSWORD');
var curMode = AppMode.LOG_IN;

console.log(curMode.isLogIn()); // output true
console.log(curMode.isSignUp()); // output false
console.log(curMode.isForgotPassword()); // output false

```

### String Constants

```javascript
var ConstJs = require('constjs');

var Weekdays = ConstJs.const("Mon, Tue, Wed");
console.log(Weekdays); // output {Mon: 'Mon', Tue: 'Tue', Wed: 'Wed'}

var today = Weekdays.Wed;
console.log(today); // output: 'Wed';
```

### Bitmap

```javascript
var ConstJs = require('constjs');

var ColorFlags = ConstJs.bitmap("blue red");
console.log(ColorFlags.blue); // output false

var StyleFlags = ConstJs.bitmap(true, "rustic model minimalist");
console.log(StyleFlags.rustic); // output true

var CityFlags = ConstJs.bitmap({Chengdu: true, Sydney: false});
console.log(CityFlags.Chengdu); //output true
console.log(CityFlags.Sydney); // output false

var DayFlags = ConstJs.bitmap(true, {Mon: false, Tue: true});
console.log(DayFlags.Mon); // output true 
```


## Input variations

Instead of a string of keys sepated by separators specified above, it can use another two variaions of input to specify keys:

```javascript

var ConstJs = require('constjs');

// use array of strings to specify keys
var Color = ConstJs.enum(["blue", "red"]);
var myColor = Color.blue;

// use arguments array to specify keys
var BuildTool = ConstJs.enum("gulp", "grunt");
var myTool = BuildTool.gulp;

// use object to specify keys
var WeekDay = ConstJs.enum({
    Monday: null,
    Tuesday: null
})
var myDay = WeekDay.Monday;
```

The input variations are supported by all three generators: `enum`, `const` and `bitmap`


## Immutatibility

`constjs` tried to use `Object.freeze()` to make the enum/const/bitmap object be immutabile. If your environment doesn't support `Object.freeze()`, e.g. IE 8 or before, you can still use `constjs`, but the object returned is not immutable.

Dependencies
--------------

* `lodash`