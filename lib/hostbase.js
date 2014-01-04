/**
 * Created by root on 12/31/13.
 */

var msocket = require('./msocket');
var optimist = require('optimist').default('log-dir', null);

//var bunyan = require('bunyan');
//var log = bunyan.createLogger({name: "myapp"});
//log.info("hi");

var logger = require('tracer').console(
    {
        format : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
        dateformat : "HH:MM:ss.L"
    });

var http = require('http');


var HostBase = exports.HostBase = function (options) {
    var self = this,
        server,
        clients = [],
        status = {},
        opts = {};

    server = msocket.createServer(function(socket){
        socket.data('', function(){});
    });

    server.on('start', function(){
        self.status.serverStartTime = new Date();
    });

    server.socket.on('connection', function(connection){
        // new clients connect.
        if (!connection) {
            logger.error('Empty Socket connection');
            return;
        }
    });

    server.socket.on('connect', function(socket){
        // client connect success.

        //self.clients.push(socket);
        self.clients[socket.address] = {socket: socket, connectTime: new Date()};

        logger.info('New connection with: ' + socket.remoteAddress +':'+ socket.remotePort);
    });
};

HostBase.prototype.start = function start() {
    var self = this;

    self.server.listen(self.opts.port);
};

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