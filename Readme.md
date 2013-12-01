# rework-vars [![Build Status](https://travis-ci.org/visionmedia/rework-vars.png)](https://travis-ci.org/visionmedia/rework-vars)

Add support for [CSS spec style variables](http://www.w3.org/TR/css-variables/).

Note that variables are not scoped or dynamic. Every variable is in the global
scope. Variables are replaced once, and then they function as normal CSS
values. Therefore, this is _not_ some sort of polyfill, just a useful
feature.

Optionally you may pass an object of variables - `map` - from js-land.

```js
vars(map);
```

## Example

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
  background: green;
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
