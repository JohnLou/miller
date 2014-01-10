/**
 * Created by John on 1/5/14.
 */

var net = require('net'),
    util = require('util'),
    redis = require('redis'),
    _= require('underscore'),
    mconfig = require('../lib/config'),
    HostBase = require('../lib/hostbase'),
    murmurHash3 = require('../lib/murmurHash3').murmurHash3,
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
};

util.inherits(UrlHost, HostBase.HostBase);

UrlHost.prototype.InitConnection = function(socket){
    var self = this;

    UrlHost.super_.prototype.InitConnection.call(self, 'localhost');

    var rserver = self.redisServer;

    socket.data(mconfig.events.urlRequestOnClient, function(){
        logger.info('fetch client get url request.');

//        var domain = 'chuguoqu.com',
//            url = 'http://www.chuguoqu.com/',
//            urlHash = murmurHash3.x64.hash128(url);

        //
        var cond = [mconfig.feedUrls, '0', '0'];
        //logger.debug(cond);
        rserver.zrevrange(cond, function (err, _urls) {
            if (err) throw err;

            if(_urls != null && _urls.length == 1){
                var url = _urls[0], urlHash = murmurHash3.x64.hash128(url);

                rserver.hset(mconfig.getedUrls, urlHash, url, redis.print);

                socket.send(mconfig.events.urlResponseToClient, url);
            }
        });
    });

    socket.data(mconfig.events.pushUrlsOnClient, function(data){
        logger.info('fetch client push url request.');

        var domainHash = murmurHash3.x64.hash128(data.domain),
            urlHash = murmurHash3.x64.hash128(data.url);

        rserver.get(mconfig.waitUrls, domainHash, function(err, reply) {
            // reply is null when the key is missing
            logger.info(reply);

            rserver.hset(mconfig.waitUrls, domainHash, data.domain, redis.print);
        });

        rserver.zadd(mconfig.waitUrls+':'+domainHash, data.score, data.url, redis.print);
    });
}