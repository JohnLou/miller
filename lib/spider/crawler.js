/**
 * Created by root on 1/13/14.
 */
var _= require('underscore'),
    url = require('url'),
    Parser = require('./parser').Parser,
    cheerio = require('cheerio'),
    mreq = require('./mrequester'),
    msocket = require('../msocket'),
    mconfig = require('../config').mconfig,
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

exports.Crawler = Crawler = function(opts){
    var self = this;

    /**
     * opts :
     *      usHost: url server host,
     *      usPort: url server port,
     *      psHost: persistence server host,
     *      psPort: persistence server port
     */
    self.opts = opts;

    // url server client.
    self.usClient = null;
    self._buildUSClient();

    // persistence server client.
    self.psClient = null;
    self._buildPSClient();

    //
    self.parser = new Parser();
}

/**
 * build url server client.
 */
Crawler.prototype._buildUSClient = function(){
    var self = this;

    self.usClient = msocket.MSocket();

    logger.debug('connect to ' + self.opts.usHost);

    self.usClient.connect(self.opts.usHost);

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

    logger.debug('connect to ' + self.opts.psHost);

    self.psClient.connect(self.opts.psHost, self.opts.psPort);

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
Crawler.prototype._crawl = function(_url, cb){
    var self = this;

    logger.debug(_url);

    mreq.getSimple(_url, function(body, resp){

        //logger.debug(body);

        // persistence
        self.psClient.send(mconfig.events.persistenceRequestOnClient, body);

        // url parser
        logger.debug(_url);
        var _domain = url.parse(_url).hostname;
        self.parser.parse(_domain, body, cb);

    });
}