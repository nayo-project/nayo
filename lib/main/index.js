const { init_config, query_done, DataLegalityChecker } = require("../tool");
const Worker = require("../worker");
const { _accept, _transaction_process, _work_selector, _insert_one, _delete_one, _delete_many, _aggregate, _find_one, _find_one_update, _update_many, _transaction, _send_ret } = require("./Symbol");
const { db, db_url, config_symbol, worker } = require("./Symbol");
const METHODS = require("./methods");


class nayo {
    constructor(options, config) {
        this[db_url] = options.url;
        this[config_symbol] = init_config(config);
        this[worker] = new Worker(this[db_url], this[config_symbol]);
    }

    [_accept](workList) {
        try {
            if (workList.length == 1) {
                this[worker].mode = "normal";
                return this[_work_selector](workList[0]);
            } else {
                this[worker].mode = "transaction";
                return this[_transaction_process](workList);
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    [_transaction_process](workList) {
        try {
            let workPack_transaction_arr = [];
            for (let workPack of workList) {
                workPack_transaction_arr.push(this[_work_selector](workPack));
            }
            return this[_transaction](workPack_transaction_arr);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_work_selector](workPack) {
        try {
            switch (workPack.method) {
                case METHODS.insertOne:
                    return this[_insert_one](workPack);
                    break;
                case METHODS.deleteOne:
                    return this[_delete_one](workPack);
                    break;
                case METHODS.findOne:
                    return this[_find_one](workPack);
                    break;
                case METHODS.findOneAndUpdate:
                    return this[_find_one_update](workPack);
                    break;
                case METHODS.aggregate:
                    return this[_aggregate](workPack);
                    break;
                case METHODS.deleteMany:
                    return this[_delete_many](workPack);
                    break;
                case METHODS.updateMany:
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
            return this[worker].insertOne(workPack.doc, workPack.collection);
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
            return this[worker].deleteOne(workPack.target_doc, workPack.collection);
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
            return this[worker].findOne(workPack.target_doc, workPack.collection, workPack.param);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_find_one_update](workPack) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].findOneAndUpdate(workPack.target_doc, workPack.doc, workPack.collection, workPack.param, workPack.db);
                } else {
                    return this[worker].findOneAndUpdate(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
                }
            }
            return this[worker].findOneAndUpdate(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
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
            return this[worker].aggregate(workPack.pipeline, workPack.collection, workPack.param);
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
            return this[worker].deleteMany(workPack.target_doc, workPack.collection);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_update_many](workPack) {
        try {
            if (this[worker].mode == "transaction") {
                if (workPack["db"]) {
                    return this[worker].updateMany(workPack.target_doc, workPack.doc, workPack.collection, workPack.param, workPack.db);
                } else {
                    return this[worker].updateMany(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
                }
            }
            return this[worker].updateMany(workPack.target_doc, workPack.doc, workPack.collection, workPack.param);
        } catch (e) {
            throw new Error(e);
        }
    }

    [_transaction](workPack_transaction_arr) {
        try {
            return this[worker].transaction(workPack_transaction_arr);
        } catch (e) {
            throw new Error(e);
        }
    }


    // out
    push(workList) {
        return new Promise(async (resolve, reject) => {
            try {
                // check the data legality
                new DataLegalityChecker(workList);
                this[worker].gen_query_statement(workList);
                let _ret = await this[_accept](workList);
                resolve(_ret);
            } catch (e) {
                reject(e);
            }
        });
    }

    authenticate() {
        return new Promise(async (resolve, reject) => {
            try {
                let client = await this[worker].client;
                if (client.isConnected()) {
                    resolve("Connect Success");
                } else {
                    reject("Connect Fail");
                }
            } catch (e) {
                reject("Connect Fail");
            }
        })
    }
}

module.exports = nayo;