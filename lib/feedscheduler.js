/**
 * Created by root on 1/9/14.
 */
var net = require('net'),
    util = require('util'),
    _= require('underscore'),
    redis = require('redis'),
    common = require('./common'),
    mconfig = require('../lib/config'),
    schedule = require('node-schedule'),
    EventEmitter = require('eventemitter2'),
    murmurHash3 = require('../lib/murmurHash3').murmurHash3;

var logger = require('tracer').console();

var FeedScheduler = exports.FeedScheduler = function (options) {
    var self = this;

    logger.info('begin to build FeedScheduler');

    logger.info(options);

    // call base constructor
    FeedScheduler.super_.prototype.constructor.call(self, options);

    // build redis server connect.
    self.redisServer = common.connectRedis(options.redisHost, options.port);
};

util.inherits(FeedScheduler, EventEmitter.EventEmitter2);

//FeedScheduler.prototype.redisServer = {};

FeedScheduler.prototype.feeder = {};

FeedScheduler.prototype.start = function(){
    var self = this;

//    if(!self.feeder){
//        // build feed scheduler
///*
// # 文件格式说明
// #  ——分钟 (0 - 59)
// # |  ——小时 (0 - 23)
// # | |  ——日   (1 - 31)
// # | | |  ——月   (1 - 12)
// # | | | |  ——星期 (0 - 7)（星期日=0或7）
// # | | | | |
// # * * * * * 被执行的命令
// */
//        self.feeder = schedule.scheduleJob('1 * * * *', self.feed);
//    }

    logger.debug('feeder start calling.');

    // feed every 10 sec.
//    setInterval((function(_s) {         //Self-executing func which takes 'this' as self
////        return function() {   //Return a function in the context of 'self'
////            console.log('set Interval');
////            _s.feed(); //Thing you wanted to run as non-window 'this'
////        }
//        return _s.feed;
//    })(self), 3000);
    setInterval(self.feed.bind(self), 3000);
};

var site_demon = {
    domain: 'chuguoqu.com',
    dhash: murmurHash3.x64.hash128('chuguoqu.com'),
    mweight: 80, // manual weight
    tsite: 3, // site type
    stress:{
        mrv: 1, // 最大并发数
        interval: 40, // sec
        speed: 500 // m sec
    },
    statistics:{
        geted: 0,
        inqueue: 0,
        wait: 1
    }

};

//urls:{
//    key: murmurHash3.x64.hash128('http://www.chuguoqu.com/line/0-0-0-0-1-0-0-1'),
//    score: 89,
//    value: 'http://www.chuguoqu.com/line/0-0-0-0-1-0-0-1'
//}

/**
 * feed opt.
 */
FeedScheduler.prototype.feed = function(){
    var self = this,
        rserver = self.redisServer;

    logger.info('start feed.');

    rserver.hkeys(mconfig.waitUrls, function (err, _domains) {
        logger.info(_domains.length + " urls:");

        _.each(_domains, function (_dHash, i) {
            logger.info("    " + i + ": " + _dHash);

            self.feedToWait(_dHash);
        });


    });

};

FeedScheduler.prototype.feedToWait = function(_dHash){
    var self = this,
        rserver = self.redisServer;

    logger.info('start feed to wait.');

    // var feedCond = ['feed:urls:'+_dHash, '0', '0'];
    rserver.hget(mconfig.feedDomains, function(err, _fd){
        logger.debug(_fd);
        logger.debug(err);

        if(err == null && (_fd == null || _fd.length == 0)){
            // none running domain. Feed!
            logger.debug('none running domain. Feed!');

            // request url(s) for this domain.
            var cond = [mconfig.waitUrls+':'+_dHash, '0', '0', 'WITHSCORES'];
            //logger.debug(cond);
            rserver.zrevrange(cond, function (err, _urls) {
                if (err) throw err;
                logger.info('example1', _urls);

                for(var i=0; i<_urls.length; i+=2){
                    var _u = _urls[i],
                        _s = _urls[i+1],
                        _k = mconfig.feedUrls;

                    self.emit('before_feed', {key:_k, url: _u, score: _s});

                    logger.info({key:_k, url: _u, score: _s});

                    rserver.zadd(_k, _s, _u, redis.print);

                    self.emit('feed_success', {key:_k, url: _u, score: _s});

                    rserver.zrem(mconfig.waitUrls+':'+_dHash, _u);
                }
            });
        }else{
            rserver.hset(mconfig.feedDomains, _dHash);

            // EXPIRE
            var _expire = self.getSiteExpire(_dHash);
            rserver.expire(mconfig.feedDomains+':'+_dHash, _expire);
        }
    });

//    rserver.zrevrange(feedCond, function(err, _hash){
//        logger.debug(_hash);
//        logger.debug(err);
//
//        if(err == null && (_hash == null || _hash.length == 0)){
//            // none running domain. Feed!
//            logger.debug('none running domain. Feed!');
//
//            // request url(s) for this domain.
//            var cond = ['wait:urls:'+_dHash, '0', '0', 'WITHSCORES'];
//
//            logger.debug(cond);
//
//            rserver.zrevrange(cond, function (err, _urls) {
//                if (err) throw err;
//                logger.info('example1', _urls);
//
//                for(var i=0; i<_urls.length; i+=2){
//                    var _u = _urls[i],
//                        _s = _urls[i+1],
//                        _k = 'feed:urls:'+_dHash;
//
//                    self.emit('before_feed', {key:_k, url: _u, score: _s});
//
//                    logger.info({key:_k, url: _u, score: _s});
//
//                    rserver.zadd(_k, _s, _u, redis.print);
//
//                    // EXPIRE
//                    var _expire = self.getSiteExpire(_dHash);
//                    rserver.expire('feed:urls:'+_dHash, _expire);
//
//                    self.emit('feed_success', {key:_k, url: _u, score: _s});
//
//                    rserver.zrem('wait:urls:'+_dHash, _u);
//                }
//            });
//        }
//    });
};

FeedScheduler.prototype.getSiteExpire = function(_dHash){
    var self = this;
    return 40;
};

FeedScheduler.prototype.getSiteInfo = function(_dHash){
    var self = this;

    return site_demon;
};

/**
 * 简单站点权重计算。
 * @param _site
 * @returns {number}
 */
FeedScheduler.prototype.simpleSiteWeight = function(_site){
    var self = this,
        weight = 0;

    weight = _site.mweight + _site.tsite * 10 + parseInt(Math.random()*10 + 1);

    return weight;
};

