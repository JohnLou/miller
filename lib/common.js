/**
 * Created by root on 12/30/13.
 */

var fs = require('fs'),
    tls = require('tls'),
    net = require('net'),
    redis = require('redis'),
    crypto = require('crypto');

exports.createSocket = function (options) {
    options = options || {};
    options.type = options.type || 'tcp4';

    return options.type === 'tls'
        ? exports.createTlsSocket(options)
        : new net.Socket(options);
};

//
// ### function createTlsSocket (options)
// #### @options {Object} Tls options like in tls.js
// #### Should behave like tls.connect, except it just creates the socket like net.Socket
// #### Also has a function called 'connect' that will allow` it to connect to a remote host
// this is a rip of tls.js's connect
//
exports.createTlsSocket = function(options) {
    var self = this;

    //
    // Setup the TLS connection over the existing TCP connection:
    //
    // 1. Create a new instance of `net.Socket`.
    // 2. Create a new set of credentials with `options`.
    // 3. Create the TLS pair
    // 4. Pipe the TLS pair to the TCP socket
    //
    var socket = new net.Stream({ type: 'tcp4' });

    function setupTlsPipe () {
        var sslcontext = crypto.createCredentials(options),
            pair = tls.createSecurePair(sslcontext, false),
            cleartext = pipe(pair, socket);

        pair.on('secure', function() {
            var verifyError = pair.ssl.verifyError();

            if (verifyError) {
                cleartext.authorized = false;
                cleartext.authorizationError = verifyError;
            }
            else {
                cleartext.authorized = true;
            }
        });

        //
        // Setup the cleartext stream to have a `.connect()` method
        // which passes through to the underlying TCP socket.
        //
        socket.cleartext = cleartext;
        cleartext._controlReleased = true;
    }

    socket.on('connect', setupTlsPipe);

    return socket;
};

//
// helper function for createTlsSocket
//
function pipe(pair, socket) {
    pair.encrypted.pipe(socket);
    socket.pipe(pair.encrypted);

    pair.fd = socket.fd;
    var cleartext = pair.cleartext;
    cleartext.socket = socket;
    cleartext.encrypted = pair.encrypted;
    cleartext.authorized = false;

    function onerror(e) {
        if (cleartext._controlReleased) {
            cleartext.emit('error', e);
        }
    }

    function onclose() {
        socket.removeListener('error', onerror);
        socket.removeListener('close', onclose);
        socket.removeListener('timeout', ontimeout);
    }

    function ontimeout() {
        cleartext.emit('timeout');
    }

    socket.on('error', onerror);
    socket.on('close', onclose);
    socket.on('timeout', ontimeout);

    return cleartext;
}

exports.connectRedis = function(redisHost, port) {

    if(!redisHost){
        redisHost = 'localhost';
    }

    if(!port){
        port = 6379;
    }

    var redisServer = redis.createClient(port, redisHost, {retry_max_delay: 60000});

    redisServer.on("connect", function() {
        //
    });

    redisServer.on("error", function(msg) {
        console.log("Cannot connect to redis server `" + redisHost + "`: " + msg);
    });

    return redisServer;
};