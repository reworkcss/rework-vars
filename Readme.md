# rework-vars [![Build Status](https://travis-ci.org/visionmedia/rework-vars.png)](https://travis-ci.org/visionmedia/rework-vars)

A [Rework](https://github.com/visionmedia/rework) plugin to add support for the
[W3C-style CSS variables](http://www.w3.org/TR/css-variables/) syntax.

**N.B.** This is _not_ a polyfill. This plugin aims to provide a future-proof
way of using a _limited subset_ of the features provided by native CSS variables.

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

## Supported features

Variables can be declared as custom CSS properties on the `:root` element,
prefixed with `var-`:

```css
:root {
  var-my-color: red;
}
```

Variables are applied using the `var()` function, taking the name of a variable
as the first argument:

```css
:root {
  var-my-color: red;
}

div {
  color: var(my-color);
}
```

Fallback values are supported and are applied if a variable has not been
declared:

```css
:root {
  var-my-color: red;
}

div {
  color: var(my-other-color, green);
}
```

Fallbacks can be "complex". Anything after the first comma in the `var()`
function will act as the fallback value – `var(name, fallback)`. Nested
variables are also supported:

```css
:root {
  var-my-color: red;
}

div {
  background: var(my-other-color, linear-gradient(var(my-color), rgba(255,0,0,0.5)));
}
```

## What to expect

Variables can _only_ be declared for, and scoped to the `:root` element. All
other variable declarations are left untouched. Any known variables used as
values are replaced.

```css
:root {
  var-color-1: red;
  var-color-2: green;
}

:root,
div {
  var-color-2: purple;
  color: var(color-2);
}

div {
  var-color-3: blue;
}

span {
  var-color-4: yellow;
}
```

yields:

```css
:root,
div {
  var-color-2: purple;
  color: green;
}

div {
  var-color-3: blue;
}

span {
  var-color-4: yellow;
}
```

Variables are not dynamic; they are replaced with normal CSS values. The value
of a defined variable is determined by the last declaration of that variable
for `:root`.

```css
:root {
  var-brand-color: green;
}

.brand {
  color: var(brand-color);
}

:root {
  var-brand-color: red;
}
```

yields:

```css
.brand {
  color: red;
}
```

Variables declared within `@media` or `@supports` are not currently supported
and will also be ignored.

```css
@media (min-width: 320px) {
  :root {
    var-brand-color: red;
  }
}
```

yields:

```css
@media (min-width: 320px) {
  :root {
    var-brand-color: red;
  }
}
```

## License

MIT
