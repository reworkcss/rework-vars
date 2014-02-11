
/**
 * Module dependencies.
 */

var visit = require('rework-visit');

/**
 * Module export.
 */

module.exports = function(jsmap) {

  return function vars(style){
    var map = jsmap || {};

    // define variables
    style.rules.forEach(function (rule) {
      var i;
      var name;
      var varNameIndices = [];

      if (rule.type === 'rule') {
        // only variables declared for `:root` are supported
        if (rule.selectors.length === 1 && rule.selectors[0] === ':root') {
          rule.declarations.forEach(function(decl, idx){
            if (decl.property && /\bvar\-/.test(decl.property)) {
              name = decl.property.replace('var-', '');
              map[name] = decl.value;
              varNameIndices.push(idx);
            }
          });

          // remove `var-*` properties from the rule
          for (i = varNameIndices.length - 1; i >= 0; i -= 1) {
            rule.declarations.splice(varNameIndices[i], 1);
          }
        }
      }
    });

    visit(style, function(declarations, node){
      // resolve variables
      declarations.forEach(function(decl, idx){
        if (decl.value && /\bvar\(/.test(decl.value)) {
          decl.value = replaceValue(decl.value, map);
        }
      });
    });
  };
};

/**
 * Resolve CSS variables in a value
 *
 * The second argument to a CSS variable function, if provided, is a fallback
 * value, which is used as the substitution value when the referenced variable
 * is invalid.
 *
 * var(name[, fallback])
 *
 * Since the fallback can be *any* value, the value needs to be parsed
 * character-by-character to deduce the contents of a variable function.
 *
 * @param {String} value A property value known to contain CSS variable functions
 * @param {Object} map A map of variable names and values
 * @return {String} A property value with all CSS variables substituted.
 */

function replaceValue(value, map){
  // matches `var(name[, fallback])`, captures 'name' and 'fallback'
  var RE_VAR = /\bvar\(([\w-]+)(?:\s*,\s*)?(.*)?\)/;
  // matches `var()`
  var RE_EMPTY_VAR = /\bvar\(\s*\)/;

  var valueLen = value.length;
  var beginSlice = value.indexOf('var(');
  var endSlice = beginSlice + 'var('.length;
  var depth = 1;
  var currentChar;
  var cssVariable;

  // find the closing `)` of the CSS variable function,
  // accounting for nested functions
  while (endSlice < valueLen && depth > 0) {
    currentChar = value.charAt(endSlice);
    if (currentChar == '(') depth += 1;
    if (currentChar == ')') depth -= 1;
    endSlice += 1;
  }

  if (depth > 0) throw new Error('rework-vars: missing closing ")" in the value "' + value + '"');

  cssVariable = value.slice(beginSlice, endSlice);

  if (RE_EMPTY_VAR.test(cssVariable)) throw new Error('rework-vars: var() must contain a non-whitespace string');

  cssReplacement = cssVariable.replace(RE_VAR, function(_, name, fallback){
    var replacement = map[name];
    if (!replacement && !fallback) throw new Error('rework-vars: variable "' + name + '" is undefined');
    if (!replacement && fallback) return fallback;
    return replacement;
  });

  // resolve the variable
  value = value.split(cssVariable).join(cssReplacement);

  // recursively resolve any remaining variables
  if (/\bvar\(/.test(value)) {
    value = replaceValue(value, map);
  }

  return value;
}
