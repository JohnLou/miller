/**
 * Created by root on 1/10/14.
 */
var request = require('request'),
    cheerio = require('cheerio');

var logger = require('tracer').console();

exports.getSimple = function(url, cb){
    logger.debug(url);

    request.get({
        uri: url,
        encoding:'utf-8'}, function (error, resp, body) {
//        logger.debug(error);
//        logger.debug(resp);

        if (!error && resp.statusCode == 200) {
//            logger.debug(body);

            if(cb){
                cb(body, resp);
            }
        }
    })
};