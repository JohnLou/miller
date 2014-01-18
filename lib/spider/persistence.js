/**
 * Created by root on 1/10/14.
 */
var net = require('net'),
    util = require('util'),
    _= require('underscore'),
    mconfig = require('../config'),
    HostBase = require('../hostbase'),
    document = require('../models/document'),
    Documents,
    mongoClient = require('../../client/mongoClient'),
    murmurHash3 = require('../murmurHash3').murmurHash3,
    logger = HostBase.HostBase.log;

var PersistenceHost = exports.PersistenceHost = function (options) {
    var self = this,
        docuDb = new mongoClient('localhost', 1215, 'miller_main_db');

    Documents = docuDb.db.collection('documents');

    logger.info('begin to build PersistenceHost');
    logger.info(options);

    // call base constructor
    PersistenceHost.super_.prototype.constructor.call(self, options);

    self.mClient = new mongoClient(options.mongoHost, options.mongoPort);
};

util.inherits(PersistenceHost, HostBase.HostBase);

PersistenceHost.prototype.InitConnection = function(socket){
    var self = this;

    PersistenceHost.super_.prototype.InitConnection.call(self, 'localhost');

    // register the persistence request processing.
    socket.data(mconfig.events.persistenceRequestOnClient, function(data){
        logger.info('catch persistenceRequestOnClient event and do persistence.');

        var docu = {},
            now = new Date();

        var snapshot = {crawTime: now, body: data.body};

        Documents.findOne({urlHash: docu.urlHash}, function(err, _item){
            if(_item != undefined){
                docu = _item;
                docu.bodyHash = murmurHash3.x64.hash128(data.body);
                docu.lastCrawlTime = now;
                docu.isParsed = false;

                docu.sanpshots.push(snapshot);
            }else{
                docu.url = data.url;
                docu.urlHash = murmurHash3.x64.hash128(data.url);
                docu.bodyHash = murmurHash3.x64.hash128(data.body);
                docu.lastCrawlTime = now;
                docu.isParsed = false;
                docu.sanpshots = [snapshot];
            }

            Documents.save(docu, function(err, data){
                if(err){
                    logger.error(err);
                }
            });
        });

    });
}