#!/usr/bin/env node
var socketRedis = require('../socket-redis.js');
var childProcess = require('child_process');

var optimist = require('optimist').default('log-dir', null);
var fs = require('fs');
var argv = optimist.default('redis-host', 'localhost').argv;
var redisHost = argv['redis-host'];


if (!process.send) {
    argv = optimist.default('socket-ports', '9801').default('status-port', '9810').argv;
    var socketPorts = String(argv['socket-ports']).split(',');
    var publisher = new socketRedis.Server(redisHost, argv['status-port']);

    socketPorts.forEach(function(socketPort) {
        var args = ['--socket-port=' + socketPort];

        var startWorker = function() {
            var worker = childProcess.fork(__filename, args);
            console.log('Starting worker `' + worker.pid + '` to listen on port `' + socketPort + '`');
            publisher.addWorker(worker);
            worker.on('exit', function() {
                console.error('Worker `' + worker.pid + '` exited');
                publisher.removeWorker(worker);
                startWorker();
            });
            worker.on('message', function(event) {
                publisher.triggerEventUp(event.type, event.data);
            });
        };
        startWorker();
    });

    process.on('SIGTERM', function() {
        publisher.killWorkers();
        process.exit();
    });

}
