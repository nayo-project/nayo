/*
* @Author Terence孫
* @Time 2019/4/5 20:25
* */
const MongoClient = require("mongodb").MongoClient;
const { error_format, Timer_Record, query_done } = require("../tool");

class basic {
    constructor(url, db, config) {
        this.url = url;
        this.db = db;
        this.config = config;
        this.process_time = null;
        this.query_statement = [];
        // init the client
        this.client = this._connect_db();
    }

    async _connect_db() {
        return await new MongoClient(this.url, this.config.connection).connect();
    }

    /*
    * transaction
    * get new session ---> do in the session ---> commit or abort session ---> end session
    * @params: array
    * */

    async _commit_session(session) {
        return await session.commitTransaction();
    }

    __query_wrap(query, client, session) {
        return eval(query);
    }

    async _do_in_session(client, array, session){
        session.startTransaction(this.config.transaction);
        for (let query of array) {
            await this.__query_wrap(query, client, session);
        }
        return session;
    }

    transaction(array){
        return new Promise((resolve, reject) => {
            let _timer = new Timer_Record();
            try {
                _timer.start();
                let _session = null;
                Promise.resolve(this.client).then(client => {
                    // ===get new session================
                    _session = client.startSession();
                    // ===do in the session===============
                    return this._do_in_session(client, array, _session);
                }).then(session => {
                    // ===commit session================
                    return this._commit_session(session);
                }).then(v => {
                    // close to record time
                    this.process_time = _timer.end();
                    // to do something when the process done
                    // this.config.logging is the nayo config, it has default method, however, you can set your method to record
                    // this.config.logging is the function name, and this function's first argument is the this.process_time that you can use to know how much time the process waste, the second argument is the array which contain the query statement
                    // Notice: this function's first argument is always this.process_time
                    // Futher (Not yet realized): the functions's argument will have more infomation of the query process that you can get to record
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    // ===end session===================
                    _session.endSession();
                    resolve(v);
                }).catch(e => {
                    // ===abort session==================
                    _timer.reset();
                    _session.abortTransaction().then(v => {
                        reject(e);
                    }).catch(e => {
                        _timer.reset();
                        _session.endSession();
                        reject(e);
                    });
                });
            } catch (e) {
                _timer.reset();
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
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.insertOne(object);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.insertMany(array);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.deleteOne(object);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.deleteMany(object);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
    find(object={}, collection, options={}){
        return new Promise((resolve, reject) => {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            };
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            };
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _limit = options.limit ? options.limit : 0;
                let _skip = options.skip ? options.skip : 0;
                let _sort = options.sort ? options.sort : {};
                let _cursor = connect.find(object).limit(_limit).skip(_skip).sort(_sort).toArray().then(v => {
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(v);
                }).catch(e => {
                    _timer.reset();
                    reject(e);
                });
            }).catch(e=>{
                _timer.reset();
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
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.findOne(object, options);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data  = await connect.findOneAndUpdate(object, doc, options);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.findOneAndDelete(object, options);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.findOneAndReplace(object, doc, options);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
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
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then((client) => {
                let connect = client.db(this.db).collection(collection);
                let _promise = connect.aggregate(pipline, options);
                _promise.toArray().then(v => {
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(v);
                }).catch(e => {
                    _timer.reset();
                    reject(e);
                });
            }).catch(e => {
                _timer.reset();
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
                options = {};
            };
            let _timer = new Timer_Record();
            _timer.start();
            Promise.resolve(this.client).then(async (client) => {
                let connect = client.db(this.db).collection(collection);
                let _data = await connect.updateMany(filter, doc, options);
                this.process_time = _timer.end();
                query_done(this.config.logging, this.process_time, this.query_statement);
                resolve(_data);
            }).catch(e=>{
                _timer.reset();
                reject(e);
            });
        });
    }
}

module.exports = basic;