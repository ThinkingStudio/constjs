constjs
========

Create const/enum/bitmap object with key names specified in String, Array, Object or Arguments

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

#### Enum serialization/deserialization with JSON

Adding methods to enum elements could be very handy for use, however there is major concern about applying this style. Once you serialize your enum into JSON format string and parse it back, you loose all methods and suddenly all your code doesn't work anymore. Fortunately `constjs` provides a way `unJSON()` to to help you alleviate this concern:

```javascript
var ConstJs = require('constjs');

...

var Colors = ConstJs.enum('Red, Green, Blue');
...

var myData = {
    name: 'blah blah',
    color: Colors.Red
}
console.log(myData.color.isRed()); // output: true
...

var myDataStr = JSON.stringfy(myData);
...

myData = JSON.parse(myDataStr);
// console.log(myData.color.isRed()); // exception thrown out here
myData = ConstJs.unJSON(myData); 
// or myData = ConstJs.unJSON(JSON.parse(myDataStr)); the same effects
console.log(myData.color.isRed()); // output: true

```

However there is cost associated with the `unJSON` feature, say, your JSON string will contains additional data to support deserialization. If you are sure you don't need to deserialize your enum data, `constjs` provides a way to generate relatively more lightweight enum data.

Instead of 

```javascript
var Colors = ConstJs.enum('Red, Green, Blue');
```

You use `enum.transient`:

```javascript
var Colors = ConstJs.enum.transient('Red, Green, Blue');
```

or use the alias `enum.lite`:

```javascript
var Colors = ConstJs.enum.lite('Red, Green, Blue');
```

To compare the data been generated:

```javascript
var Colors = ConstJs.enum('Red, Green, Blue');
var LiteColors = ConstJs.enum.lite('Red, Green, Blue');

var myColor = Colors.Red, myLiteColor = LiteColors.Red;
console.log({myColor: myColor, myLiteColor: myLiteColor});
```

You should be able to see something like:

```javascript
{
    myColor: {_id: 'Red', _seq: 0, _kl: ['Red', 'Green', 'Blue']},
    myLiteColor: {_id: 'Red', _seq: 0}
}
```

And after `unJSON` call on `myLiteColor`, you will find that the `isRed()`, `isGreen()` and `isBlue()` method is no longer there. However you can still use `name()`, `toString()` and `is()` method on the `myColor` object after `unJSON()`:

```javascript
...
var s = JSON.stringify(myLiteColor);
var c = ConstJs.unJSON(s);

console.log(c.isRed); // output: undefined
console.log(c.name()); // output: 'Red'
console.log(c.is('Red')); // output: true
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
console.log(DayFlags.Mon); // output false. Default val wont override specified val if the type is boolean 
```


### Input variations

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

`constjs` tried to use `Object.freeze()` to make the enum/const object be immutabile:

```javascript
var ConstJs = require('constjs');

// use array of strings to specify keys
var Color = ConstJs.enum(["blue", "red"]);
Color.blue = 'blue';
console.log(Color.blue); // output {_id: 'blue', ...}

var WeekDay = ConstJs.const('Mon Tue');
WeekDay.Mon = false;
console.log(WeekDay.Mon); // output: 'Mon'
WeekDay.Wed = 'Wed';
console.log(WeekDay.Wed); // output: 'undefined'
```

For `bitmap` object, `constjs` use `Object.seal()` so the flag could be set/unset. However it still doesn't allow properties been removed or added:

```javascript
var ConstJs = require('constjs');

var ColorFlags = ConstJs.bitmap("blue red");
ColorFlags.blue = true;
console.log(ColorFlags.blue); // output: true
ColorFlags.brown = false;
console.log(ColorFlags.brown); // output: 'undefined'
```

However `constjs` provided an `immutable` function to `bitmap` thus it ensure the data returned is completely frozen:

```javascript
var ConstJs = require('constjs');

var ColorFlags = ConstJs.bitmap.immutable("blue red");
ColorFlags.blue = true;
console.log(ColorFlags.blue); // output: false
ColorFlags.brown = false;
console.log(ColorFlags.brown); // output: 'undefined'
```



Dependencies
--------------

* `lodash`