const ObjectId = require("mongodb").ObjectId;
const { __convert_work, init_config, query_done } = require("../tool");
const Worker = require("../worker");
const { _accept, _transaction_process, _work_selector, _insert_one, _delete_one, _delete_many, _aggregate, _find_one, _find_one_update, _update_many, _transaction, _send_ret } = require("./Symbol");

if (process.env.nayo != "test") {
    var { db_name, db_url, config_symbol, worker } = require("./Symbol");
} else {
    var db_name = "db_name";
    var db_url = "db_url";
    var config_symbol = "config_symbol";
    var worker = "worker";
}

class nayo {
    constructor(options, config) {
        this[db_name] = options.db;
        this[db_url] = options.url;
        this[config_symbol] = init_config(config);
        if (process.env.nayo == "test") {
            this.test_methods_arr = [];
            this[worker] = new Object();
            this.test_worker = this[worker];
        } else {
            this[worker] = new Worker(this[db_url], this[db_name], this[config_symbol]);
        }
    }

    [_accept](workList) {
        try {
            if (workList.length == 1) {
                this[worker].mode = "normal";
                return this[_work_selector](workList[0]);
            } else {
                this[worker].mode = "transaction";
                this[_transaction_process](workList);
                /*let _err_list = [];
                for (let index in workList) {
                    // check the method number
                    // for transaction, the method should be limited, only for CUD, NO R
                    let item = workList[index];
                    if (item.method != 0 && item.method != 1 && item.method != 3 && item.method != 5 && item.method != 6) {
                        _err_list.push(index);
                    }
                }
                if (_err_list.length == 0) {

                } else {
                    throw new Error({
                        name: "transaction method type error",
                        msg: "the method of the work_pack data are not allowed",
                        index: _err_list
                    });
                }*/
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    [_transaction_process](workList) {
        try {
            let workPack_transaction_arr = [];
            if (process.env.nayo == "test") {
                this.test_methods_arr.push("transaction");
            }
            for (let workPack of workList) {
                workPack_transaction_arr.push(this[_work_selector](workPack));
            }
            this[_transaction](workPack_transaction_arr);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_work_selector](workPack) {
        try {
            switch (workPack.method) {
                case 0:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(0);
                    }
                    return this[_insert_one](workPack);
                    break;
                case 1:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(1);
                    }
                    return this[_delete_one](workPack);
                    break;
                case 2:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(2);
                    }
                    return this[_find_one](workPack);
                    break;
                case 3:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(3);
                    }
                    return this[_find_one_update](workPack);
                    break;
                case 4:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(4);
                    }
                    return this[_aggregate](workPack);
                    break;
                case 5:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(5);
                    }
                    return this[_delete_many](workPack);
                    break;
                case 6:
                    if (process.env.nayo == "test") {
                        this.test_methods_arr.push(6);
                    }
                    return this[_update_many](workPack);
                    break;
                default:
                    throw new Error("invalid parameter");
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    // method
    [_insert_one](workPack) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].insertOne(workPack.doc, workPack.collection, workPack.db);
                } else {
                    return this[worker].insertOne(workPack.doc, workPack.collection);
                }
            }
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].insertOne(workPack.doc, workPack.collection);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_delete_one](workPack) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].deleteOne(workPack.target_doc, workPack.collection, workPack.db);
                } else {
                    return this[worker].deleteOne(workPack.target_doc, workPack.collection);
                }
            }
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].deleteOne(workPack.target_doc, workPack.collection);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_find_one](workPack) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].findOne(workPack.target_doc, workPack.collection, workPack.param, workPack.db);
                } else {
                    return this[worker].findOne(workPack.target_doc, workPack.collection, workPack.param);
                }
            }
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].findOne(workPack.target_doc, workPack.collection, workPack.param);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_find_one_update](workPack) {
        try {
            // if (workPack.target_doc._id) {
            //     workPack.target_doc = {_id: new ObjectId(workPack.target_doc._id)};
            // }
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].findOneAndUpdate(workPack.target_doc, workPack.doc, workPack.collection, workPack.param, workPack.db);
                } else {
                    return this[worker].findOneAndUpdate(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
                }
            }
            process.env.nayo == "test"?Promise.resolve(true):this[worker].findOneAndUpdate(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_aggregate](workPack) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].aggregate(workPack.pipeline, workPack.collection, workPack.param, workPack.db);
                } else {
                    return this[worker].aggregate(workPack.pipeline, workPack.collection, workPack.param);
                }
            }
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].aggregate(workPack.pipeline, workPack.collection, workPack.param);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_delete_many](workPack, TOOL) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].deleteMany(workPack.target_doc, workPack.collection, workPack.db);
                } else {
                    return this[worker].deleteMany(workPack.target_doc, workPack.collection);
                }
            }
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].deleteMany(workPack.target_doc, workPack.collection);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_update_many](workPack) {
        try {
            // if (workPack.target_doc._id) {
            //     workPack.target_doc = {_id: new ObjectId(workPack.target_doc._id)};
            // }
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].updateMany(workPack.target_doc, workPack.doc, workPack.collection, workPack.param, workPack.db);
                } else {
                    return this[worker].updateMany(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
                }
            }
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].updateMany(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_transaction](workPack_transaction_arr) {
        try {
            return process.env.nayo == "test"?Promise.resolve(true):this[worker].transaction(workPack_transaction_arr);
        } catch (e) {
            throw new Error(e);
        }
    }


    // out
    push(workList) {
        return new Promise((resolve, reject) => {
            try {
                // check the data legality
                // this.
                if (process.env.nayo != "test") {
                    this[worker].gen_query_statement(workList);
                }
                resolve(this[_accept](workList));
            } catch (e) {
                reject(e);
            }
        });
    }

    authenticate() {
        return new Promise((resolve, reject) => {
            try {
                Promise.resolve(this[worker].client).then(client => {
                    if (client.isConnected()) {
                        resolve("Connect Success");
                    } else {
                        reject("Connect Fail");
                    }
                }).catch(e => {
                    reject("Connect Fail");
                });
            } catch (e) {
                reject("Connect Fail");
            }
        })
    }
}

module.exports = nayo;