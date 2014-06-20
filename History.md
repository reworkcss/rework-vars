* fix resolution of variables that contain a CSS function in their fallback

3.1.0 / 2014-06-19
==================

* remove Component(1) support
* add the option to preserve variables in the output

3.0.0 / 2014-04-17
==================

* update syntax from `var-*` to `--*` to match spec

2.0.3 / 2014-02-11
==================

* fix persistent vars map

2.0.2 / 2013-12-18
==================

 * fix `var-*` property stripping from output

2.0.1 / 2013-12-18
==================

 * fix the plugin throwing errors when processing anything that isn't a basic rule

2.0.0 / 2013-12-18
==================

 * limit variable declarations to `:root`
 * determine the value of variables before replacement
 * disallow variable declarations within `@media` and `@supports`

1.1.0 / 2013-12-01
==================

 * add support for fallback values
 * add support for overwriting variable values
 * add stripping of old `var-*` properties from output

1.0.1 / 2013-07-23
==================

 * fix for comments nested inside selectors
