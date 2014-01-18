/**
 * Created by evan on 14-1-18.
 */

var skin = require('mongoskin');

mongoClient = function (host, port, db) {
    this.db = skin.db('john:john-i5wei.cn@' + host + ':' + port + '/' + db + '?auto_reconnect')
}

mongoClient.prototype.save = function (tablename, item, callback) {
    var self = this

    self.db.collection(tablename).save(item,{safe:true}, callback)
};

mongoClient.prototype.getCollection = function (tablename, callback) {
    callback(null, this.db.collection(tablename))
};

mongoClient.prototype.findAll = function(tablename, callback) {
    this.db.collection(tablename).find().toArray(function(err, results){
        if( err ) callback(error)
        else callback(null, results)
    });
};

mongoClient.prototype.findById = function(tablename, id, callback) {
    this.db.collection(tablename).findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
    });
};

mongoClient.prototype.findByItem = function(tablename, itemname, itemvalue, callback) {
    var opt = {}
    opt[itemname] = itemvalue
    this.db.collection(tablename).findOne(opt, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
    });
};

mongoClient.prototype.findByCust = function(tablename, opt, callback) {
    this.db.collection(tablename).findOne(opt, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
    });
};

exports = mongoClient;
