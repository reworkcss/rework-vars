
# rework-vars

  Add CSS spec style variable support (the ones that used to be in core).

  Note that this does not cascade like the CSS variable
  spec does, thus this is _not_ some sort of fallback mechanism, just a useful
  feature. Optionally you may pass an `object` of variables from js-land.

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
:root {
  var-header-color: #06c;
  var-main-color: #c06
}

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

# License

  MIT
