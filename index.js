/**
 * Module dependencies.
 */

var balanced = require('balanced-match');
var visit = require('rework-visit');

/**
 * Constants.
 */

var VAR_PROP_IDENTIFIER = '--';
var VAR_FUNC_IDENTIFIER = 'var';

/**
 * Module export.
 */

module.exports = function(options) {

  return function vars(style){
    options = options || {};
    options.map = options.map || {};
    options.preserve = options.preserve !== undefined ? options.preserve : false;

    // define variables
    style.rules.forEach(function (rule) {
      var varNameIndices = [];

      if (rule.type !== 'rule') return;
      // only variables declared for `:root` are supported
      if (rule.selectors.length !== 1 || rule.selectors[0] !== ':root') return;

      rule.declarations.forEach(function(decl, idx){
        var prop = decl.property;
        var val = decl.value;

        if (prop && prop.indexOf(VAR_PROP_IDENTIFIER) === 0) {
          options.map[prop] = val;
          varNameIndices.push(idx);
        }
      });

      if (!options.preserve) {
        // remove `--*` properties from the rule
        for (var i = varNameIndices.length - 1; i >= 0; i -= 1) {
          rule.declarations.splice(varNameIndices[i], 1);
        }
      }
    });

    // resolve variables
    visit(style, function(declarations, node){
      for (var i = 0; i < declarations.length; i++) {
        var decl = declarations[i]
        // Could be comments
        if (decl.type !== 'declaration') continue;

        if (decl.value && decl.value.indexOf(VAR_FUNC_IDENTIFIER + '(') !== -1) {
          if (!options.preserve) {
            decl.value = resolveValue(decl.value, options);
          }
          else {
            declarations.splice(i++, 0, {
              type: decl.type,
              property: decl.property,
              value: resolveValue(decl.value, options)
            });
          }
        }
      }
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
 * @param {String} value A property value known to contain CSS variable functions
 * @param {Object} options An object containings options
 * @return {String} A property value with all CSS variables substituted.
 */

function resolveValue(value, options){
  // matches `name[, fallback]`, captures 'name' and 'fallback'
  var RE_VAR = /([\w-]+)(?:\s*,\s*)?(.*)?/;
  var balancedParens = balanced('(', ')', value);
  var varRef = balanced(VAR_FUNC_IDENTIFIER + '(', ')', value).body;

  if (!balancedParens) throw new Error('rework-vars: missing closing ")" in the value "' + value + '"');
  if (varRef === '') throw new Error('rework-vars: var() must contain a non-whitespace string');

  var varFunc = VAR_FUNC_IDENTIFIER + '(' + varRef + ')';

  var varResult = varRef.replace(RE_VAR, function(_, name, fallback){
    var replacement = options.map[name];
    if (!replacement && !fallback) throw new Error('rework-vars: variable "' + name + '" is undefined');
    if (!replacement && fallback) return fallback;
    return replacement;
  });

  // resolve the variable
  value = value.split(varFunc).join(varResult);

  // recursively resolve any remaining variables in the value
  if (value.indexOf(VAR_FUNC_IDENTIFIER) !== -1) {
    value = resolveValue(value, options);
  }

  return value;
}
