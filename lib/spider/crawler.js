/**
 * Created by root on 1/13/14.
 */
var _= require('underscore'),
    url = require('url'),
    parser = require('./parser'),
    cheerio = require('cheerio'),
    mreq = require('./mrequester'),
    msocket = require('../msocket'),
    mconfig = require('../config'),
    murmurHash3 = require('../murmurHash3').murmurHash3;

var logger = require('tracer').console();

/**
 * opts :
 *      url server host,
 *      url server port,
 *      persistence server host,
 *      persistence server port
 * @type {Function}
 */

exports.crawler = Crawler = function(opts){
    var self = this;

    self.opts = opts;
}

/**
 * opts :
 *      usHost: url server host,
 *      usPort: url server port,
 *      psHost: persistence server host,
 *      psPort: persistence server port
 * @type {{}}
 */
Crawler.prototype.opts = {};

/**
 * url server client.
 * @type {{}}
 */
Crawler.prototype.usClient = {};

/**
 * persistence server client.
 * @type {{}}
 */
Crawler.prototype.psClient = {};

/**
 * build url server client.
 */
Crawler.prototype._buildUSClient = function(){
    var self = this;

    self.usClient = msocket.MSocket();

    logger.debug('connect to ' + self.usHost);

    self.usClient.connect(self.usHost);

    self.usClient.data(['welcome'], function(data){
        logger.debug('us client connect success.');
//        self.usSocket.send(mconfig.events.urlRequestOnClient);
//
//        self.usSocket.send(mconfig.events.pushUrlsOnClient, {domain: 'chuguoqu.com', score: 89, url:'http://www.chuguoqu.com/line/0-0-0-0-1-0-0-1'});
    });

    self.usClient.data(mconfig.events.urlResponseToClient, function(data){
        // do crawl
        self._crawl(data);
    });
}

/**
 * build persistence server client.
 */
Crawler.prototype._buildPSClient = function(){
    var self = this;

    self.psClient = msocket.MSocket();

    logger.debug('connect to ' + self.psHost);

    self.psClient.connect(self.psHost, self.psPort);

    self.psClient.data(['welcome'], function(data){
        logger.debug('ps client connect success.');
    });
}

Crawler.prototype.run = function(){
    var self = this;

    self.usClient.send(mconfig.events.urlRequestOnClient);
}

/**
 * do crawl.
 * @param url
 */
Crawler.prototype._crawl = function(_url){
    var self = this;

    mreq.getSimple(_url, function(body, resp){
        // persistence
        self.psClient.send(mconfig.events.persistenceRequestOnClient, body);

        // url parser
        var _domain = url.parser(_url).domain;
        urlParser.parse(_domain, body);
    });
}