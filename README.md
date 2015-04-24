gen_const
=========

Create a constant object with key names specified in String or object

This simple tool extends `keyMirror` from ReactJS in a way that it accept more varieties of input to specify the constant keys

Usage
-----

`npm install gen_const`

```javascript
var genConst = require('gen_enum');
var COLORS = genConst("blue red");
var myColor = COLORS.blue;
console.log(myColor); // output blue
```

Input:  `"key1 key2 ..."`

Note, other than `space` keys could also be separated by `,`, `;` and `:`

Output: 

```
{
    key1: 'key1',
    key2: 'key2'
}
```

Input variations
-----------------

Instead of a string of keys sepated by separators specified above, it can use another two variaions of input to specify keys:

```javascript

// use array of strings to specify keys
var Color = genConst("blue", "red");
var myColor = Color.blue; // 'blue'

// use object to specify keys
var WeekDay = genConst({
    Monday: null,
    Tuesday: null
})
var myDay = WeekDay.Monday; // 'Monday'
```

