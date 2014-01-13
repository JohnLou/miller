/**
 * parser base.
 *
 * Created by root on 1/10/14.
 */

Parser = function(){

    function Parser(baseDir) {
        this.baseDir = baseDir;
        this.parsers = null;
        this.checked = [];
        this.revalidate = false;
    }
}

Parser.prototype.getModulePrefix = function(name) {
    if (!name) {
        return '';
    }
    if (name === 'miller') {
        return '';
    }
    return name.replace('miller-', '');
};

Parser.prototype.parse = function(domain, body){
    //
}

Parser.prototype.getModuleParsers = function(moduleName) {
    var cPath, definition, dependency, e, loader, name, prefix, _ref, _ref1, _results;
    if (this.checked.indexOf(moduleName) !== -1) {
        return;
    }
    this.checked.push(moduleName);
    try {
        definition = require("/" + moduleName + "/component.json");
    } catch (_error) {
        e = _error;
        if (moduleName.substr(0, 1) === '/') {
            return this.getModuleParsers("miller-" + (moduleName.substr(1)));
        }
        return;
    }
    for (dependency in definition.dependencies) {
        this.getModuleParsers(dependency.replace('/', '-'));
    }

    if (!definition.miller) {
        return;
    }

    prefix = this.getModulePrefix(definition.name);

    if (moduleName[0] === '/') {
        moduleName = moduleName.substr(1);
    }

    if (definition.miller.loader) {
        loader = require("/" + moduleName + "/" + definition.miller.loader);
        loader(this);
    }
    if (definition.miller.parsers) {
        _ref = definition.miller.parsers;
        for (name in _ref) {
            cPath = _ref[name];
            if (cPath.indexOf('.coffee') !== -1) {
                cPath = cPath.replace('.coffee', '.js');
            }
            this.registerParser(prefix, name, "/" + moduleName + "/" + cPath);
        }
    }
};

Parser.prototype.listParsers = function(callback) {
    if (this.parsers !== null) {
        return callback(this.parsers);
    }
    this.parsers = {};
    this.getModuleParsers(this.baseDir);
    return callback(this.parsers);
};

Parser.prototype.load = function(name, callback) {
    var component, componentName, implementation, instance,
        _this = this;
    if (!this.parsers) {
        this.listParsers(function(parsers) {
            return _this.load(name, callback);
        });
        return;
    }
    component = this.parsers[name];
    if (!component) {
        for (componentName in this.parsers) {
            if (componentName.split('/')[1] === name) {
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
        implementation = component;
        instance = new component;
    } else {
        implementation = require(component);
        instance = implementation.getComponent();
    }

    return callback(instance);
};

Parser.prototype.registerParser = function(packageId, name, cPath, callback) {
    var fullName, prefix;
    prefix = this.getModulePrefix(packageId);
    fullName = "" + prefix + "/" + name;
    if (!packageId) {
        fullName = name;
    }
    this.components[fullName] = cPath;
    if (callback) {
        return callback();
    }
};

exports = Parser;