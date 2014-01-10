/**
 * Created by root on 1/10/14.
 */
var request = require('request'),
    cheerio = require('cheerio');

exports.getSimple = function(url, cb){
    request(url, function(err, resp, body){
        $ = cheerio.load(body);
        cb($);
    });
}