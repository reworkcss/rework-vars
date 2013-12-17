# rework-vars [![Build Status](https://travis-ci.org/visionmedia/rework-vars.png)](https://travis-ci.org/visionmedia/rework-vars)

A [Rework](https://github.com/visionmedia/rework) plugin to add support for the
[W3C-style CSS variables](http://www.w3.org/TR/css-variables/) syntax.

**N.B.** This is _not_ a polyfill. Variables can only be declared and scoped to
the `:root` element. They cannot be declared within `@media` or `@supports`
blocks. Every variable is in the global scope. Variables are replaced once, and
then function as normal CSS values.

## Installation

```
npm install rework-vars
```

## Use

As a Rework plugin:

```js
// dependencies
var fs = require('fs');
var rework = require('rework');
var vars = require('rework-vars');

// css to be processed
var css = fs.readFileSync('build/build.css', 'utf8').toString();

// process css using rework-vars
var out = rework(css).use(vars()).toString();
```

Optionally, you may pass an object of variables - `map` - to the JavaScript
function.

```js
var map = {
  'app-bg-color': 'white'
}

var out = rework(css).use(vars(map)).toString();
```

## Example output

```css
:root {
  var-header-bg-color: green;
  var-content-bg-color: green;
}

.main-header {
  background: var(header-bg-color);
}

.main-content {
  background: var(content-bg-color) !important;
}

:root {
  var-header-bg-color: red;
}

.sub-header {
  background: var(header-bg-color);
  /* simple fallback */
  color: var(missing, white);
}

.sub-content {
  /* complex fallback */
  background: var(missing, linear-gradient(to top, var(content-bg-color), white)) !important;
}
```

yields:

```css
.main-header {
  background: red;
}

.main-content {
  background: green !important;
}

.sub-header {
  background: red;
  /* simple fallback */
  color: white;
}

.sub-content {
  /* complex fallback */
  background: linear-gradient(to top, green, white) !important;
}
```

## License

MIT
