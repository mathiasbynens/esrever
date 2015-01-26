# Esrever [![Build status](https://travis-ci.org/mathiasbynens/esrever.svg?branch=master)](https://travis-ci.org/mathiasbynens/esrever) [![Code coverage status](https://coveralls.io/repos/mathiasbynens/esrever/badge.svg)](https://coveralls.io/r/mathiasbynens/esrever) [![Dependency status](https://gemnasium.com/mathiasbynens/esrever.svg)](https://gemnasium.com/mathiasbynens/esrever)

_Esrever_ is a Unicode-aware string reverser written in JavaScript. It allows you to easily reverse any string of Unicode symbols, while handling combining marks and astral symbols just fine. [Here’s an online demo.](https://mothereff.in/reverse-string)

## Why not just use `string.split('').reverse().join('')`?

The following code snippet is commonly used to reverse a string in JavaScript:

```js
// Don’t use this!
var naiveReverse = function(string) {
  return string.split('').reverse().join('');
};
```

However, there are some problems with this solution. For example:

```js
naiveReverse('foo 𝌆 bar');
// → 'rab �� oof'
// Where did the `𝌆` symbol go? Whoops!
```

If you’re wondering why this happens, [read up on JavaScript’s internal character encoding](https://mathiasbynens.be/notes/javascript-encoding).

But there’s more:

```js
naiveReverse('mañana mañana');
// → 'anãnam anañam'
// Wait, so now the tilde is applied to the `a` instead of the `n`? WAT.
```

In order to correctly reverse any given string, Esrever implements an algorithm that was [originally developed](http://www.youtube.com/watch?v=UODX_pYpVxk&t=33s "Work It") by Missy ‘Misdemeanor’ Elliot in September 2002:

> _I put my thang down, flip it, and reverse it.
> I put my thang down, flip it, and reverse it._

And indeed: by swapping the position of any combining marks with the symbol they belong to, as well as reversing any surrogate pairs before further processing the string, the above issues are avoided successfully. Thanks, Missy!

## Installation

Via [npm](https://www.npmjs.com/):

```bash
npm install esrever
```

Via [Bower](http://bower.io/):

```bash
bower install esrever
```

Via [Component](https://github.com/component/component):

```bash
component install mathiasbynens/esrever
```

In a browser:

```html
<script src="esrever.js"></script>
```

In [Narwhal](http://narwhaljs.org/), [Node.js](https://nodejs.org/), and [RingoJS](http://ringojs.org/):

```js
var esrever = require('esrever');
```

In [Rhino](http://www.mozilla.org/rhino/):

```js
load('esrever.js');
```

Using an AMD loader like [RequireJS](http://requirejs.org/):

```js
require(
  {
    'paths': {
      'esrever': 'path/to/esrever'
    }
  },
  ['esrever'],
  function(esrever) {
    console.log(esrever);
  }
);
```

## API

### `esrever.version`

A string representing the semantic version number.

### `esrever.reverse(string)`

This function takes a string and returns the reversed version of that string, correctly accounting for Unicode combining marks and astral symbols.

## Usage example

```js
var input = 'Lorem ipsum 𝌆 dolor sit ameͨ͆t.';
var reversed = esrever.reverse(input);

console.log(reversed);
// → '.teͨ͆ma tis rolod 𝌆 muspi meroL'

esrever.reverse(reversed) == input;
// → true
```

### Using the `esrever` binary

To use the `esrever` binary in your shell, simply install Esrever globally using npm:

```bash
npm install -g esrever
```

After that you will be able to reverse strings from the command line:

```bash
$ esrever 'I put my thang down, flip it, and reverse it.'
.ti esrever dna ,ti pilf ,nwod gnaht ym tup I

$ esrever 'H̹̙̦̮͉̩̗̗ͧ̇̏̊̾Eͨ͆͒̆ͮ̃͏̷̮̣̫̤̣ ̵̞̹̻̀̉̓ͬ͑͡ͅCͯ̂͐͏̨̛͔̦̟͈̻O̜͎͍͙͚̬̝̣̽ͮ͐͗̀ͤ̍̀͢M̴̡̲̭͍͇̼̟̯̦̉̒͠Ḛ̛̙̞̪̗ͥͤͩ̾͑̔͐ͅṮ̴̷̷̗̼͍̿̿̓̽͐H̙̙̔̄͜'
H̙̙̔̄͜Ṯ̴̷̷̗̼͍̿̿̓̽͐Ḛ̛̙̞̪̗ͥͤͩ̾͑̔͐ͅM̴̡̲̭͍͇̼̟̯̦̉̒͠O̜͎͍͙͚̬̝̣̽ͮ͐͗̀ͤ̍̀͢Cͯ̂͐͏̨̛͔̦̟͈̻ ̵̞̹̻̀̉̓ͬ͑͡ͅEͨ͆͒̆ͮ̃͏̷̮̣̫̤̣H̹̙̦̮͉̩̗̗ͧ̇̏̊̾

$ cat foo.txt
These are the contents of `foo.txt`.
This is line two.

$ esrever -f foo.txt
.owt enil si sihT
.`txt.oof` fo stnetnoc eht era esehT

$ esrever -l foo.txt
.`txt.oof` fo stnetnoc eht era esehT
.owt enil si sihT
```

Why not just use the good old `rev` command instead? Glad you asked. `rev` doesn’t account for Unicode combining marks:

```bash
$ rev <<< 'mañana mañana'
anãnam anañam
```

On the other hand, the `esrever` binary returns the expected result:

```
$ esrever 'mañana mañana'
anañam anañam
```

See `esrever --help` for the full list of options.

## Support

Esrever has been tested in at least Chrome 27-29, Firefox 3-22, Safari 4-6, Opera 10-12, IE 6-10, Node.js v0.10.0, io.js v1.0.0, Narwhal 0.3.2, RingoJS 0.8-0.11, PhantomJS 1.9.0, and Rhino 1.7RC4.

## Unit tests & code coverage

After cloning this repository, run `npm install` to install the dependencies needed for Esrever development and testing. You may want to install Istanbul _globally_ using `npm install istanbul -g`.

Once that’s done, you can run the unit tests in Node using `npm test` or `node tests/tests.js`. To run the tests in Rhino, Ringo, Narwhal, and web browsers as well, use `grunt test`.

To generate the code coverage report, use `grunt cover`.

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## License

Esrever is available under the [MIT](https://mths.be/mit) license.
