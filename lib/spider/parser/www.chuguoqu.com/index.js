/**
 * Created by root on 1/13/14.
 */
var parser = require('../../parser'),
    cheerio = require('cheerio'),
    util = require('util'),
    XRegExp = require('xregexp').XRegExp,
    logger = parser.log;


var CgqParser = function (options) {
    var self = this;

    self.domain = 'www.chuguoqu.com';
    self.urlListExp = '(\bhttp://www\.chuguoqu\.com/|/)(line|ticketing|food|amusements|shopping)/0-0-0-0-1-0-0-\d*',
    self.urlDetailExp = "(\bhttp://www\.chuguoqu\.com/|/)(.*/product-\d*)";

    logger.debug('begin to build chuguoqu.com parser');

    // call base constructor
    CgqParser.super_.prototype.constructor.call(self, options);
};

util.inherits(CgqParser, parser.Parser);

CgqParser.prototype.parseUrl = function(body, cb){
    var self = this,
        listExp = XRegExp(self.urlListExp),
        detailExp = XRegExp(self.urlDetailExp);

    if(!body){
        return;
    }

    logger.debug('begin parse www.chuguoqu.com urls.');
    var $ = cheerio.load(body);

    $('a').each(function(i, elem) {

        var _href = $(this).attr('href');

        if(self.isValidLink(_href)){
            if(listExp.test(_href)){
                // list
                logger.debug('get list: ' + _href);
            }

            if(detailExp.test(_href)){
                // detail
                logger.debug('get detail: ' + _href);
            }
        }

    });

    if(cb){cb();}
};

exports.getParser = function(){
    return new CgqParser();
}