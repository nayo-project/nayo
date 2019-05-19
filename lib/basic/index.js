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
        this.mode = "normal";  // normal and transaction
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
        return new Promise(async (resolve, reject) => {
            let _timer = new Timer_Record();
            try {
                _timer.start();
                let client = await this.client;
                // ===get new session================
                let _session = client.startSession();
                try {
                    // ===do in the session===============
                    _session = await this._do_in_session(client, array, _session);
                    // ===commit session================
                    let _ret = await this._commit_session(_session);
                    // close to record time
                    this.process_time = _timer.end();
                    // to do something when the process done
                    // this.config.logging is the nayo config, it has default method, however, you can set your method to record
                    // this.config.logging is the function name, and this function's first argument is the this.process_time that you can use to know how much time the process waste, the second argument is the array which contain the query statement
                    // Notice: this function's first argument is always this.process_time
                    // Futher (Not yet realized): the functions's argument will have more infomation of the query process that you can get to record
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    await _session.endSession();
                    resolve(_ret);
                } catch (e) {
                    // ===abort session==================
                    _timer.reset();
                    try {
                        await _session.abortTransaction();
                    } catch (e) {
                        _timer.reset();
                        await _session.endSession();
                        reject(e);
                    }
                }
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
    insertOne(object, collection, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").insertOne(${JSON.stringify(object)}, { "session": session });`;
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.insertOne(object);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }

    }


    /*
    * insertMany
    *
    * @params array, collection
    *
    * */
    insertMany(array, collection, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(array) != "[object Array]") {
                throw new Error("the first param should be Array");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").insertMany(${JSON.stringify(array)}, { "session": session });`;
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(array) != "[object Array]") {
                    return reject(new Error("the first param should be Array"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.insertMany(array);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * deleteOne
    *
    * @params object, collection
    *
    * */
    deleteOne(object, collection, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").deleteOne(${JSON.stringify(object)}, { "session": session });`;
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.deleteOne(object);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }


    /*
    * deleteMany
    *
    * @params object, collection
    *
    * */
    deleteMany(object, collection, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").deleteMany(${JSON.stringify(object)}, { "session": session });`;
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.deleteMany(object);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * find
    *
    * @params object, options, collection
    * @options
    *      limit: Number
    *      sort: Object
    *      skip: Number
    * feature use
    * */
    find(object={}, collection, options={}, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                return reject(new Error("the first param should be Object"));
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                return reject(new Error("the second param should be String"));
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            let _limit = options.limit ? options.limit : 0;
            let _skip = options.skip ? options.skip : 0;
            let _sort = options.sort ? options.sort : {};
            // TODO
            return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").find(${JSON.stringify(object)}, { "session": session }).limit(${_limit}).skip(${_skip}).sort(${_sort}).toArray()`;
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _limit = options.limit ? options.limit : 0;
                    let _skip = options.skip ? options.skip : 0;
                    let _sort = options.sort ? options.sort : {};
                    let _cursor_ret = await connect.find(object).limit(_limit).skip(_skip).sort(_sort).toArray();
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_cursor_ret);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * findOne
    *
    * @params object, options, collection
    * @options
    *      limit: Number
    *      sort: Object
    *      skip: Number
    *
    * */
    findOne(object={}, collection, options={}, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            if (Object.keys(options).length == 0) {
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOne(${JSON.stringify(object)}, { "session": session });`;
            } else {
                options["nayo_replace"] = "nayo_replace";
                let options_str = JSON.stringify(options).replace('"nayo_replace":"nayo_replace"', '"session": session');
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOne(${JSON.stringify(object)}, ${options_str});`;
            }
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.findOne(object, options);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * findOneAndUpdate
    *
    * @params object, collection, doc, options
    * @options
    *      limit: Number
    *      sort: Object
    *      skip: Number
    *
    * */
    findOneAndUpdate(object={}, doc, collection, options={}, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(doc) != "[object Object]") {
                throw new Error("the second param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the third param should be String");
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            if (Object.keys(options).length == 0) {
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOneAndUpdate(${JSON.stringify(object)}, ${JSON.stringify(doc)}, { "session": session });`;
            } else {
                options["nayo_replace"] = "nayo_replace";
                let options_str = JSON.stringify(options).replace('"nayo_replace":"nayo_replace"', '"session": session');
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOneAndUpdate(${JSON.stringify(object)}, ${JSON.stringify(doc)}, ${options_str});`;
            }
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(doc) != "[object Object]") {
                    return reject(new Error("the second param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the third param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data  = await connect.findOneAndUpdate(object, doc, options);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * findOneAndDelete
    *
    * @params object, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    findOneAndDelete(object={}, collection, options={}, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            if (Object.keys(options).length == 0) {
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOneAndDelete(${JSON.stringify(object)}, { "session": session });`;
            } else {
                options["nayo_replace"] = "nayo_replace";
                let options_str = JSON.stringify(options).replace('"nayo_replace":"nayo_replace"', '"session": session');
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOneAndDelete(${JSON.stringify(object)}, ${options_str});`;
            }
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.findOneAndDelete(object, options);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * findOneAndReplace
    *
    * @params object, doc, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    findOneAndReplace(object={}, doc, collection, options={}, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(object) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(doc) != "[object Object]") {
                throw new Error("the second param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the third param should be String");
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            if (Object.keys(options).length == 0) {
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOneAndReplace(${JSON.stringify(object)}, ${JSON.stringify(doc)}, { "session": session });`;
            } else {
                options["nayo_replace"] = "nayo_replace";
                let options_str = JSON.stringify(options).replace('"nayo_replace":"nayo_replace"', '"session": session');
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").findOneAndReplace(${JSON.stringify(object)}, ${JSON.stringify(doc)}, ${options_str});`;
            }
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(object) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(doc) != "[object Object]") {
                    return reject(new Error("the second param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the third param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.findOneAndReplace(object, doc, options);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
    }

    /*
    * aggregate
    *
    * @params pipeline, collection, options
    * @options ---> the same as api doc
    *
    *
    * */
    aggregate(pipeline, collection, options={}, db={}) {
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(pipeline) != "[object Array]") {
                throw new Error("the first param should be Array");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the second param should be String");
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            if (Object.keys(options).length == 0) {
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").aggregate(${JSON.stringify(pipeline)}, { "session": session });`;
            } else {
                options["nayo_replace"] = "nayo_replace";
                let options_str = JSON.stringify(options).replace('"nayo_replace":"nayo_replace"', '"session": session');
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").aggregate(${JSON.stringify(pipeline)}, ${options_str});`;
            }
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(pipeline) != "[object Array]") {
                    return reject(new Error("the first param should be Array"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the second param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _promise_ret = await connect.aggregate(pipeline, options).toArray();
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_promise_ret);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }
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
    updateMany(filter, doc, collection, options={}, db={}){
        if (this.mode == "transaction") {
            if (Object.prototype.toString.call(filter) != "[object Object]") {
                throw new Error("the first param should be Object");
            }
            if (Object.prototype.toString.call(doc) != "[object Object]") {
                throw new Error("the second param should be Object");
            }
            if (Object.prototype.toString.call(collection) != "[object String]") {
                throw new Error("the third param should be String");
            }
            if (Object.prototype.toString.call(options) != "[object Object]") {
                options = {};
            }
            // if (db && Object.prototype.toString.call(db) != "[object String]") {
            //     throw new Error("the db param should be String");
            // }
            if (Object.keys(options).length == 0) {
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").updateMany(${JSON.stringify(filter)}, ${JSON.stringify(doc)}, { "session": session });`;
            } else {
                options["nayo_replace"] = "nayo_replace";
                let options_str = JSON.stringify(options).replace('"nayo_replace":"nayo_replace"', '"session": session');
                return `client.db("${db["name"]?db["name"]:this.db["name"]}").collection("${collection}").updateMany(${JSON.stringify(filter)}, ${JSON.stringify(doc)}, ${options_str});`;
            }
        } else {
            return new Promise(async (resolve, reject) => {
                if (Object.prototype.toString.call(filter) != "[object Object]") {
                    return reject(new Error("the first param should be Object"));
                }
                if (Object.prototype.toString.call(doc) != "[object Object]") {
                    return reject(new Error("the second param should be Object"));
                }
                if (Object.prototype.toString.call(collection) != "[object String]") {
                    return reject(new Error("the third param should be String"));
                }
                if (Object.prototype.toString.call(options) != "[object Object]") {
                    options = {};
                }
                let _timer = new Timer_Record();
                _timer.start();
                try {
                    let client = await this.client;
                    let connect = client.db(this.db["name"]).collection(collection);
                    let _data = await connect.updateMany(filter, doc, options);
                    this.process_time = _timer.end();
                    query_done(this.config.logging, this.process_time, this.query_statement);
                    resolve(_data);
                } catch (e) {
                    _timer.reset();
                    reject(e);
                }
            });
        }

    }
}

module.exports = basic;