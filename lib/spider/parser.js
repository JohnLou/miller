/**
 * parser base.
 *
 * Created by root on 1/10/14.
 */

var _= require('underscore'),
    logger = require('tracer').console();

Parser = function(){

    function Parser(baseDir) {
        this.baseDir = baseDir;
        this.parsers = null;
        this.checked = [];
        this.revalidate = false;
    }
}

Parser.prototype.parse = function(domain, body){
    //
}

/**
 * get all parser on packageDir.
 * @param packageDir: parsers base dir.
 * @returns {*}
 */
Parser.prototype.getParsers = function(packageDir) {
    var self = this, definition, dependency,
        domain, main;

    var lastIndex = packageDir.length - 1;
    if(packageDir[lastIndex] === "/"){
        packageDir = packageDir.substr(0, lastIndex);
    }

    if (this.checked.indexOf(packageDir) !== -1) {
        return;
    }

    this.checked.push(packageDir);

    if(packageDir[0] === "/"){
        packageDir = packageDir.substr(1);
    }
    try {
        definition = require("/" + packageDir + "/mpconfig.json");
    } catch (_error) {
        logger.error(_error);
        return;
    }
    for (dependency in definition.dependencies) {
        this.getParsers(dependency.replace('/', '-'));
    }

    if (!definition.miller) {
        return;
    }

    if(definition.miller.parsers){
        // register and load.
        var _pars = definition.miller.parsers,
            _results = [];
        _.each(_pars, function(_par){
            if(!_par.main){
                _par.main = 'index.js';
            }

            _results.push(self.registerParser(packageDir, _par.domain, _par.main));

            return _results;
        });
    }
};

Parser.prototype.listParsers = function(callback) {
    if (this.parsers !== null) {
        return callback(this.parsers);
    }

    this.parsers = {};
    this.getParsers(this.baseDir);
    return callback(this.parsers);
};

Parser.prototype.load = function(domain, callback) {
    var implementation, instance, _this = this;

    if (!this.parsers) {
        this.listParsers(function(parsers) {
            return _this.load(domain, callback);
        });
        return;
    }
    var _parser = this.parsers[domain];
    if (!_parser) {
        for (domain in this.parsers) {

            if (domain.split('/')[1] === name) {
                component = this.parsers[componentName];
                break;
            }
        }
        if (!component) {
            throw new Error("Component " + name + " not available with base " + this.baseDir);
            return;
        }
    }

    if (typeof component === 'function') {
        implementation = _parser;
        instance = new _parser;
    } else {
        implementation = require(_parser);
        instance = implementation.getComponent();
    }

    return callback(instance);
};

/**
 * register the domain parser.
 * @param packageDir
 * @param domain
 * @param main
 * @param callback
 * @returns {*}
 */
Parser.prototype.registerParser = function(packageDir, domain, main, callback) {
    var fullName = packageDir + "/" + domain;

    this.parsers[fullName] = main;
    if (callback) {
        return callback();
    }
};

exports = Parser;