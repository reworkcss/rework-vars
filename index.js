
/**
 * Module dependencies.
 */

var visit = require('rework-visit');

/**
 * Add variable support.
 *
 *   :root {
 *     var-header-color: #06c;
 *   }
 *
 *   h1 {
 *     background-color: var(header-color);
 *   }
 *
 * yields:
 *
 *   h1 {
 *     background-color: #06c;
 *   }
 *
 */

module.exports = function(map) {
  map = map || {};

  function replace(str) {
    return str.replace(/\bvar\((.*?)\)/g, function(_, name){
      var val = map[name];
      if (!val) throw new Error('variable "' + name + '" is undefined');
      if (val.match(/\bvar\(/)) val = replace(val);
      return val;
    });
  }

  return function vars(style){
    // map vars
    visit(style, function(declarations, node){
      var varPropIndexes = [];

      declarations.forEach(function(decl, i){
        if (!decl.property || 0 != decl.property.indexOf('var-')) return;
        var name = decl.property.replace('var-', '');
        map[name] = decl.value;
        // store the index of each `var-*` property
        varPropIndexes.push(i);
      });

      // make sure indices are always sorted in ascending order
      varPropIndexes.sort(function(a, b){ return a - b; });

      // reverse loop so that the known indices are not affected as elements
      // are removed from the original array
      for (var i = varPropIndexes.length - 1; i >= 0; i -=1) {
        declarations.splice(varPropIndexes[i], 1);
      }
    });

    // substitute values
    visit(style, function(declarations, node){
      declarations.forEach(function(decl){
        if (!decl.value || !decl.value.match(/\bvar\(/)) return;
        decl.value = replace(decl.value);
      });
    });
  }
};
