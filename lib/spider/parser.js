/**
 * parser base.
 *
 * Created by root on 1/10/14.
 */

var _= require('underscore'),
    logger = require('tracer').console();

var Parser = exports.Parser = function(baseDir){
    this.baseDir = baseDir;
    this.parsers = null;
    this.checked = [];
    this.revalidate = false;
}

/**
 * get all parser on packageDir.
 * @param packageDir: parsers base dir.
 * @returns {*}
 */
Parser.prototype.getParsers = function(packageDir) {
    var self = this, definition, dependency,
        domain, main;

    logger.debug('begin getParsers');

//    var lastIndex = packageDir.length - 1;
//    if(packageDir[lastIndex] === "/"){
//        packageDir = packageDir.substr(0, lastIndex);
//    }

    if (this.checked.indexOf(packageDir) !== -1) {
        return;
    }

    this.checked.push(packageDir);

//    if(packageDir[0] === "/"){
//        packageDir = packageDir.substr(1);
//    }

    try {
        definition = require(packageDir + "/mpconfig.json");
    } catch (_error) {
        logger.error(_error);
        return;
    }
    for (dependency in definition.dependencies) {
        this.getParsers(dependency.replace('/', '-'));
    }

    logger.debug(definition);

    if (!definition.miller) {
        return;
    }

    if(definition.miller.parsers){
        // register and load.
        var _pars = definition.miller.parsers,
            _results = [];

        logger.debug(_pars);

        _.each(_pars, function(_par){

            logger.debug(_par);

            if(!_par.main){
                _par.main = 'index.js';
            }

            _results.push(self.registerParser(packageDir, _par.domain, _par.main));

            logger.debug(_results);
        });

        logger.debug(this.parsers);

        return _results;
    }
};

Parser.prototype.listParsers = function(callback) {
    if (this.parsers !== null) {
        return callback(this.parsers);
    }

    if(this.baseDir ==  null){
        return;
    }

    this.parsers = {};
    this.getParsers(this.baseDir);
    return callback(this.parsers);
};

/**
 * parser loader.
 * @param domain
 * @param callback
 * @returns {*}
 */
Parser.prototype.load = function(domain, callback) {
    var implementation, instance, self = this;

    logger.debug('with base dir: ' + this.baseDir);

    if (this.parsers === null) {
        this.listParsers(function(parsers) {
            return self.load(domain, callback);
        });
        return;
    }
    var _parser = this.parsers[domain];
    if (!_parser) {
        throw new Error("Domain parser " + domain + " not available with base " + this.baseDir);
        return;
    }

    if (typeof _parser === 'function') {
        implementation = _parser;
        instance = new _parser;
    } else {
        logger.debug(_parser);
        implementation = require(_parser);
        instance = implementation.getParser();
        logger.debug(instance);
    }

    if(callback){
        return callback(instance);
    }
    return instance;
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
    var path = packageDir + "/" + domain + '/' + main;

    logger.debug('begin registerParser');

    logger.debug('path: ' + path + ' domain: ' + domain);

    this.parsers[domain] = path;
    if (callback) {
        return callback();
    }

    return path;
};

Parser.prototype.parse = function(domain, body){
    //
}

Parser.prototype.isValidLink = function(_href){
    var result = true;

    if(!_href){
        return false;
    }

    if(_href === '#' || _href.indexOf('javascript:') > -1){
        return false;
    }
}