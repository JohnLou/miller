(function() {
  var EventEmitter, RespServer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
    EventEmitter = require('events').EventEmitter;
  } else {
    EventEmitter = require('emitter');
  }

  RespServer = (function(_super) {
    __extends(RespServer, _super);

    RespServer.prototype.name = '';

    function RespServer(name) {
      this.name = name != null ? name : '';
    }

    return RespServer;

  })(EventEmitter);

}).call(this);
