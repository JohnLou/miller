# On Node.js we use the build-in EventEmitter implementation
if typeof process isnt 'undefined' and process.execPath and process.execPath.indexOf('node') isnt -1
  {EventEmitter} = require 'events'
# On browser we use Component's EventEmitter implementation
else
  EventEmitter = require 'emitter'

class RespServer extends EventEmitter
  name: ''

  # ## Creating new resposity client
  constructor: (@name = '') ->