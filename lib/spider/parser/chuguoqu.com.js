/**
 * Created by root on 1/13/14.
 */
var parser = require('./parser'),
    util = require('util');

exports = CgqParser = function () {
    var self = this;

    logger.debug('begin to build chuguoqu.com parser');

    // call base constructor
    CgqParser.super_.prototype.constructor.call(self, options);
};

util.inherits(CgqParser, parser.Parser);