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
    expect(output).to.Throw(Error, 'rework-vars: empty var() is not allowed in CSS');
  });

  it('throws an error when a variable function references an undefined variable', function(){
    var output = function () {
      return rework(fixture('substitution-undefined')).use(vars).toString();
    };
    expect(output).to.Throw(Error, 'rework-vars: variable "test" is undefined');
  });

  it('substitutes defined variables', function(){
    compareFixtures('substitution-defined');
  });

  it('overwrites variables in place', function(){
    compareFixtures('substitution-overwrite');
  });

  it('substitutes undefined variables if there is a fallback', function(){
    compareFixtures('substitution-fallback');
  });

  it('supports case-sensitive variables', function(){
    compareFixtures('case-sensitive');
  });
});
