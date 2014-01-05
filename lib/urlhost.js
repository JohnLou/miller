/**
 * Created by John on 1/5/14.
 */

var net = require('net'),
    util = require('util'),
    HostBase = require('../lib/hostbase'),
    logger = HostBase.HostBase.log;

//var logger = require('tracer').console(
//    {
//        format : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
//        dateformat : "HH:MM:ss.L"
//    });

var UrlHost = exports.UrlHost = function (options) {
    var self = this;

    logger.info('begin to build UrlHost');

    logger.info(options);

    // call base constructor
    UrlHost.super_.prototype.constructor.call(self, options);



//    self.server.socket.data('get_url', function(event, callback){
//        self.log.info('catch get_url request!');
//    });
};

util.inherits(UrlHost, HostBase.HostBase);

UrlHost.prototype.InitConnection = function(socket){
    socket.data('get_url', function(){
        logger.info('fetch client get url request.');
    });
}