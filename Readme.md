
# rework-vars [![Build Status](https://travis-ci.org/visionmedia/rework-vars.png)](https://travis-ci.org/visionmedia/rework-vars)

Add support for [CSS spec style variables](http://www.w3.org/TR/css-variables/).

Note that variables are not scoped or dynamic. Every variable is in the global
scope. Variables are replaced once, and then they function as normal CSS
values. Therefore, this is _not_ some sort of fallback mechanism, just a useful
feature.

Optionally you may pass an object of variables - `map` - from js-land.

```js
vars(map);
```

## Example

```css
:root {
  var-header-color: #06c;
  var-main-color: #c06;
}

div {
  var-accent-background: linear-gradient(to top, var(main-color), white);
}

h1 {
  background-color: var(header-color);
}

.content {
  background: var(accent-background) !important;
}
```

yields:

```css
div {
  var-accent-background: linear-gradient(to top, #c06, white)
}

h1 {
  background-color: #06c
}

.content {
  background: linear-gradient(to top, #c06, white) !important
}
```

## License

MIT
