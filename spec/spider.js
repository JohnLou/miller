var chai = require('chai');

//
//describe('NoFlo interface', function() {
//    return it('should be able to tell whether it is running on browser', function() {
//        return chai.expect(noflo.isBrowser()).to.equal(browser);
//    });
//});

var assert = require("assert"),
    logger = require('tracer').console(),
    Parser = require('../lib/spider/parser').Parser;

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});

describe('parser', function(){
    describe('#isValidLink()', function(){
        it('should return false with like #', function(){
            var _p = new Parser();
            assert.equal(false, _p.isValidLink('#'));
        })
    });

    describe('#load()', function(){
        it('should return demo parser for chuguoqu.com', function(){
            var _p = new Parser('/home/evan/dev/miller/master/lib/spider/parser');

            _p.load('chuguoqu.com', function(_par){
                assert.equal('chuguoqu.com', _par.domain);
            });
        })
    })
});

