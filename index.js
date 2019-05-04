/**
 * @name nayo
 * @version v1.1.2
 * @author terence
 * @time 2019/5/4 22:42
 * MIT Licensed
*/

'use strict';

const nayo = require('./lib/nayo');

// here will support the transaction options
// if you set up the MongoClient, you will meet the readPreference, you can set up it like here http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
// but when you set up the transaction, you will also meet the config readPreference, however, the documents are not specified in particular
// http://mongodb.github.io/node-mongodb-native/3.1/api/global.html#TransactionOptions
// so, when you want to set up the readPreference, you should require ReadPreference like "const ReadPreference = require("nayo").ReadPreference"
// how to use it, please see here http://mongodb.github.io/node-mongodb-native/2.0/api/ReadPreference.html
// may be, you can read the pymongo to know more, it is somewhat similar to Node
// http://api.mongodb.com/python/current/api/pymongo/read_preferences.html
nayo.ReadPreference  = require("mongodb").ReadPreference

module.exports = nayo;