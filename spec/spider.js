var chai = require('chai');

//
//describe('NoFlo interface', function() {
//    return it('should be able to tell whether it is running on browser', function() {
//        return chai.expect(noflo.isBrowser()).to.equal(browser);
//    });
//});

var assert = require("assert"),
    http = require('http'),
    request = require('request'),
    logger = require('tracer').console(),
    Parser = require('../lib/spider/parser').Parser,
    Crawler = require('../lib/spider/crawler').Crawler;

describe('parser', function(){
    describe('#isValidLink()', function(){
        it('should return false with like #', function(){
            var _p = new Parser();
            assert.equal(false, _p.isValidLink('#'));
        })
    });

    describe('#load()', function(){
        it('should return demo parser for chuguoqu.com', function(){
            var _p = new Parser();

            _p.load('www.chuguoqu.com', function(_par){
                assert.equal('www.chuguoqu.com', _par.domain);
            });
        });
    });
});

describe('crawler', function(){
    describe('#_crawl()', function(){

        it('show body', function(done){

//            this.timeout(15000);
//            setTimeout(done, 15000);
            var _c = new Crawler();
            _c._crawl('http://www.chuguoqu.com/line/', done);

            assert.equal(false, false);
        })
    });
});

