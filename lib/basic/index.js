/*
* @Author Terence孫
* @Time 2019/4/5 20:25
* */
const MongoClient = require("mongodb").MongoClient;
const { error_format } = require("../tool");

class basic {
    constructor(url, db, config) {
        this.url = url;
        this.db = db;
        this.config = config;
        // init the client
        this.client = MongoClient.connect(this.url, this.config.connection).catch(e => {
            console.log(error_format(new Date(), e))
        });
    }

    /*
    * transaction
    * get new session ---> do in the session ---> commit or abort session ---> end session
    * @params: array
    *       array:
    * */

    async _commit_session(session) {
        return await session.commitTransaction();
    }

    async _do_in_session(client, array, session){
        session.startTransaction(this.config.transaction);
        let _connect = {};
        let _pro_list_1 = [];
        array[0].forEach((item, index) => {
            _connect[index] = eval(item);
        });
        array[1].forEach((item, index) => {
            _pro_list_1.push(eval(item));
        });
        await Promise.all(_pro_list_1);
        return session;
    }

    transaction(array){
        return new Promise((resolve, reject) => {
            try {
                let _client = null;
                let _session = null;
                this.client.then(client => {
                    _client = client;
                    // ===get new session================
                    _session = client.startSession();
                    // ===do in the session===============
                    return this._do_in_session(_client, array, _session);
                }).then(session => {
                    // ===commit session================
                    return this._commit_session(session);
                    // ===end session===================
                }).then(v => {
                    _session.endSession();
                    resolve(v);
                }).catch(e => {
                    // ===abort session==================
                    _session.abortTransaction().then(v => {
                        reject(e);
                    }).catch(e => {
                        _session.endSession();
                        reject(e);
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /*
    * insertOne
    *
    * @params object, collection
    *
    * */
    insertOne(object, collection){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.insertOne(object);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }


    /*
    * insertMany
    *
    * @params array, collection
    *
    * */
    insertMany(array, collection){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(array) != "[object Array]") {
                return reject(new Error("the first param should be Array"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.insertMany(array);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * deleteOne
    *
    * @params object, collection
    *
    * */
    deleteOne(object, collection){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.deleteOne(object);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }


    /*
    * deleteMany
    *
    * @params object, collection
    *
    * */
    deleteMany(object, collection){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.deleteMany(object);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * find
    *
    * @params object, options, collection
    * @options
    *      limit: Number, ----> 限制返回的个数
    *      sort: Object, -----> 排序，1正序，-1倒叙，按照index(若有的话),{"xx": 1}
    *      skip: Number, -----> 跳过几个数据
    *
    * */
    find(object={}, collection, options={}, ){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the third param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _limit = options.limit ? options.limit : 0;
                let _skip = options.skip ? options.skip : 0;
                let _sort = options.sort ? options.sort : {};
                let _cursor = connect.find(object).limit(_limit).skip(_skip).sort(_sort).toArray().then(v => {
                    resolve(v);
                }).catch(e => {
                    reject(e);
                });
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * findOne
    *
    * @params object, options, collection
    * @options
    *      limit: Number, ----> 限制返回的个数
    *      sort: Object, -----> 排序，1正序，-1倒叙，按照index(若有的话),{"xx": 1}
    *      skip: Number, -----> 跳过几个数据
    *
    * */
    findOne(object={}, collection, options={} ){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the third param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.findOne(object, options);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * findOneAndUpdate
    *
    * @params object, collection, doc, options
    * @options
    *      limit: Number, ----> 限制返回的个数
    *      sort: Object, -----> 排序，1正序，-1倒叙，按照index(若有的话),{"xx": 1}
    *      skip: Number, -----> 跳过几个数据
    *
    * */
    findOneAndUpdate(object={}, doc, collection, options={}){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(doc) != "[object Object]") {
                return reject(new Error("the second param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the third param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the fourth param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise  = connect.findOneAndUpdate(object, doc, options);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * findOneAndDelete
    *
    * @params object, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    findOneAndDelete(object={}, collection, options={}){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the third param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.findOneAndDelete(object, options);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * findOneAndReplace
    *
    * @params object, doc, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    findOneAndReplace(object={}, doc, collection, options={}){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(doc) != "[object Object]") {
                return reject(new Error("the second param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the third param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the fourth param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.findOneAndReplace(object, doc, options);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    /*
    * aggregate
    *
    * @params pipline, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    aggregate(pipline, collection, options={}) {
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(pipline) != "[object Array]") {
                return reject(new Error("the first param should be Array"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the third param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.aggregate(pipline, options);
                _promise.toArray().then(v => {
                    resolve(v);
                }).catch(e => {
                    reject(e);
                });
            }).catch(e => {
                reject(e);
            });
        });
    }

    // updateOne
    // replaced by findOneAndUpdate


    /*
    * updateMany
    *
    * @params array, doc, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    updateMany(filter, doc, collection, options={}){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(filter) != "[object Object]") {
                return reject(new Error("the first param should be Array"));
            };
            if (Object.prototype.toString.call(doc) != "[object Object]") {
                return reject(new Error("the second param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the third param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                return reject(new Error("the fourth param should be Object"));
            };
            this.client.then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.updateMany(filter, doc, options);
                resolve(_promise);
            }).catch(e=>{
                reject(e);
            });
        });
    }
}

module.exports = basic;