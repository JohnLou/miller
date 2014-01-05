/**
 * Created by root on 12/31/13.
 */

var msocket = require('./msocket'),
    util = require('util'),
    EventEmitter = require('eventemitter2'),
    optimist = require('optimist').default('log-dir', null),
    http = require('http');

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
    var self = this,
        server,
        clients = [],
        status = {},
        opts = {};

    logger.info('begin build hostbase!');

    logger.info(options);

    server = msocket.createServer(options, function(socket){


        socket.data('', function(){});

        socket.on('connection', function(connection){
            // new clients connect.
            if (!connection) {
                logger.error('Empty Socket connection');
                return;
            }

            logger.info('New connection with: ' + socket.remoteAddress +':'+ socket.remotePort);
        });

        socket.on('connect', function(socket){
            // client connect success.

            //self.clients.push(socket);
            self.clients[socket.address] = {socket: socket, connectTime: new Date()};

            logger.info('New connection with: ' + socket.remoteAddress +':'+ socket.remotePort);
        });

    });

//    server.on('start', function(){
//        self.status.serverStartTime = new Date();
//    });

    server.listen(options.port);

    logger.info('end build hostbase!');
};

util.inherits(HostBase, EventEmitter.EventEmitter2);

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