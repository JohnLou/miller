/**
 * Created by root on 1/9/14.
 */

var _= require('underscore'),
    msocket = require('../msocket'),
    mconfig = require('../config'),
    murmurHash3 = require('../murmurHash3').murmurHash3;

var logger = require('tracer').console();

exports.pushUrl = pushUrl = function(opt){
    var sock = msocket.MSocket();

    sock.connect(1215);

    sock.data(['welcome'], function(data){
        sock.send(mconfig.events.pushUrlsOnClient, opt);
    });
};

exports.mockPush = function(){
    var seeds = [
        {domain: 'chuguoqu.com', score: 89, url:'http://www.chuguoqu.com/line/0-0-0-0-1-0-0-1'},
        {domain: 'chuguoqu.com', score: 80, url:'http://www.chuguoqu.com/ticketing/0-0-0-0-1-0-0-1/'},
        {domain: 'chuguoqu.com', score: 20, url:'http://www.chuguoqu.com/food/0-0-0-0-1-0-0-1'},
        {domain: 'chuguoqu.com', score: 120, url:'http://www.chuguoqu.com/amusements/0-0-0-0-1-0-0-1'},
        {domain: 'chuguoqu.com', score: 9, url:'http://www.chuguoqu.com/shopping/0-0-0-0-1-0-0-1'}
    ];
    _.each(seeds, function(seed){
        pushUrl(seed);
    });
}