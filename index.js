
/**
 * Module dependencies.
 */

var visit = require('rework-visit');

/**
 * Module export.
 */

module.exports = function(map) {
  map = map || {};

  function replace(str) {
    return str.replace(/\bvar\((.*?)\)/g, function(_, name){
      var val = map[name];
      if (!val) throw new Error('rework-vars: variable "' + name + '" is undefined');
      if (val.match(/\bvar\(/)) val = replace(val);
      return val;
    });
  }

  return function vars(style){
    // map vars
    visit(style, function(declarations, node){
      var varPropIndexes = [];

      declarations.forEach(function(decl, i){
        if (decl.property && /\bvar\-/.test(decl.property)) {
          var name = decl.property.replace('var-', '');
          map[name] = decl.value;
          // store the index of each `var-*` property
          varPropIndexes.push(i);
        }

        if (decl.value && /\bvar\(/.test(decl.value)) {
          decl.value = replace(decl.value);
        }
      });

      // make sure indices are always sorted in ascending order
      varPropIndexes.sort(function(a, b){ return a - b; });

      // reverse loop so that the known indices are not affected as elements
      // are removed from the original array
      for (var i = varPropIndexes.length - 1; i >= 0; i -=1) {
        declarations.splice(varPropIndexes[i], 1);
      }
    });
  };
};
