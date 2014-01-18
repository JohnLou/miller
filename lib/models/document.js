/**
 * Created by evan on 14-1-18.
 */
const mongoose = require('mongoose');

var sanpshot_schema = new mongoose.Schema({
    crawTime: Date,
    body: String
});

var documents_schema = new mongoose.Schema({
    url: String,
    urlHash: String,
    bodyHash: String,
    lastCrawlTime: Date,
    isParsed: Boolean,
    sanpshots: [sanpshot_schema]
});

var document = module.exports = mongoose.model('document', documents_schema);