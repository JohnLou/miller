(function() {
  var EventEmitter, RespClient,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
    EventEmitter = require('events').EventEmitter;
  } else {
    EventEmitter = require('emitter');
  }

  RespClient = (function(_super) {
    __extends(RespClient, _super);

    RespClient.prototype.name = '';

    function RespClient(name) {
      this.name = name != null ? name : '';
    }

    return RespClient;

  })(EventEmitter);

}).call(this);
