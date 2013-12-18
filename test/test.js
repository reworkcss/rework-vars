var fs = require('fs');
var rework = require('rework');
var expect = require('chai').expect;
var vars = require('..')();

function fixture(name){
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

function compareFixtures(name){
  return expect(
    rework(fixture(name))
    .use(vars)
    .toString().trim()
  ).to.equal(fixture(name + '.out'));
}

describe('rework-vars', function(){
  it('removes variable properties from the output', function(){
    compareFixtures('remove-properties');
  });

  it('throws an error when a variable function is empty', function(){
    var output = function () {
      return rework(fixture('substitution-empty')).use(vars).toString();
    };
    expect(output).to.Throw(Error, 'rework-vars: var() must contain a non-whitespace string');
  });

  it('throws an error when a variable function references an undefined variable', function(){
    var output = function () {
      return rework(fixture('substitution-undefined')).use(vars).toString();
    };
    expect(output).to.Throw(Error, 'rework-vars: variable "test" is undefined');
  });

  it('throws an error when a variable function is malformed', function(){
    var output = function () {
      return rework(fixture('substitution-malformed')).use(vars).toString();
    };
    expect(output).to.Throw(Error, 'rework-vars: missing closing ")" in the value "var(test, rgba(0,0,0,0.5)"');
  });

  it('ignores variables defined in a media query', function(){
    compareFixtures('substitution-defined');
  });

  it('substitutes defined variables in `:root` only', function(){
    compareFixtures('substitution-defined');
  });

  it('overwrites variables correctly', function(){
    compareFixtures('substitution-overwrite');
  });

  it('substitutes undefined variables if there is a fallback', function(){
    compareFixtures('substitution-fallback');
  });

  it('supports case-sensitive variables', function(){
    compareFixtures('case-sensitive');
  });
});
