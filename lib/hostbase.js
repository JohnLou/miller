/**
 * Created by root on 12/31/13.
 */

var msocket = require('./msocket'),
    util = require('util'),
    common = require('./common'),
    EventEmitter = require('eventemitter2'),
    optimist = require('optimist').default('log-dir', null),
    http = require('http'),
    redis = require('redis');

//var bunyan = require('bunyan');
//var log = bunyan.createLogger({name: "myapp"});
//log.info("hi");

//var logger = require('tracer').console(
//    {
//        format : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
//        dateformat : "HH:MM:ss.L"
//    });

var logger = require('tracer').console();


var HostBase = exports.HostBase = function (options) {
    var self = this;
//        server,
//        clients = [],
//        status = {},
//        opts = {};

    logger.info('begin build hostbase!');

    logger.info(options);

    self.clients = [];
    self.status = {};

    self.server = msocket.createServer(options, function(socket){
        logger.info('begin create server.');

        socket.send(['welcome'], {msg:'welcome to connect miller server', serverTime: new Date()});

        self.InitConnection(socket);

        //self.clients.push(socket);
        self.clients.push({socket: socket, connectTime: new Date()});
    });

    self.server.on('start', function(){
        self.status.serverStartTime = new Date();
    });

    self.server.listen(options.port);

    logger.info('end build hostbase!');
};

util.inherits(HostBase, EventEmitter.EventEmitter2);

HostBase.prototype.InitConnection = function(socket){
    var self = this;

    self.connectRedis('localhost');
};

HostBase.prototype.start = function start() {
    var self = this;

    self.server.listen(self.opts.port);
};

HostBase.log = logger;

/**
 * @param {Number} statusPort
 */
HostBase.prototype.createStatusServer = function(statusPort) {
    var server = http.createServer(function(request, response) {
        //
    });
    server.on('connection', function(socket) {
        socket.setTimeout(10000);
    });
    server.listen(statusPort);
};

HostBase.prototype.redisServer = {};

/**
 * @param {String} redisHost
 */
HostBase.prototype.connectRedis = function(redisHost, port) {
    var self = this;

    if(!redisHost){
        redisHost = 'localhost';
    }

    if(!port){
        port = 6379;
    }

    logger.debug(redisHost + port);

    if(self.redisServer && self.redisServer != {}){
        logger.info('server redis has connected.')
    }

    self.redisServer = common.connectRedis(redisHost, port);
};