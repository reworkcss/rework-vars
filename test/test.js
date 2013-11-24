var fs = require('fs');
var rework = require('rework');
var should = require('should');
var vars = require('..')();

function fixture(name){
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

describe('rework-vars', function(){
  it('should replace variables', function(){
    rework(fixture('original'))
      .use(vars)
      .toString().trim()
      .should.equal(fixture('expected'));
  });
});
