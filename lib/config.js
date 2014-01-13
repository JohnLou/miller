/**
 * Created by root on 1/10/14.
 */
mconfig = function(){

};

mconfig.prototype = {
    waitUrls: 'wait:urls',
    getedUrls: 'geted:urls',
    feedUrls: 'feed:urls',
    feedDomains: 'feed:domains',

    events:{
        urlRequestOnClient: 'request_url', // trigger on client to request url
        urlResponseToClient: 'response_url', // post url to client (spider)
        pushUrlsOnClient: 'push_urls', // push urls to url host.
        pushReCrawlUrlsOnClient: 'push_re_crawl_urls', // push urls which need re-crawl on client

        // persistence events
        persistenceRequestOnClient: 'request_persistence'
    }
}

exports.mconfig = new mconfig(this);