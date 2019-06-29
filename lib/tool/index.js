let database_config_default = require("../config").database;
const ObjectId = require("mongodb").ObjectId;
let _ = require("underscore");
const METHODS = require("./../main/methods");

/*
* data legality check
* to check the legalit of data and correct the workPack construction
* */
class DataLegalityChecker {
    constructor(workList) {
        this.workList = workList;
        this.__workList_construction_check();
        if (workList.length > 1) {
            this.__transaction_inspect();
        }
        for (let workPack of workList) {
            this.__workPack_inspect(workPack);
        }
    }

    __workList_construction_check() {
        if (Object.prototype.toString.call(this.workList) != "[object Array]") {
            throw new TypeError("the workList should be Array!");
        }
        if (this.workList.length < 1) {
            throw new Error("the workList should not be empty!");
        }
    }

    __transaction_inspect() {
        let _err_list = [];
        for (let index in this.workList) {
            // check the method number
            // for transaction, the method should be limited, only for CUD, NO R
            let item = this.workList[index];
            if (item.method != METHODS.insertOne && item.method != METHODS.deleteOne && item.method != METHODS.findOneAndUpdate && item.method != METHODS.deleteMany && item.method != METHODS.updateMany) {
                _err_list.push(index);
            }
        }
        if (_err_list.length != 0) {
            let error = {
                name: "transaction method type error",
                msg: "the method of the work_pack data are not allowed",
                index: _err_list
            };
            throw new Error(JSON.stringify(error));
        }
    }

    __inspect_0(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }
    __inspect_1(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["target_doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (workPack["target_doc"]["_id"]) {
            if (!(workPack["target_doc"]["_id"] instanceof ObjectId)) {
                try {
                    workPack["target_doc"]["_id"] = new ObjectId(workPack["target_doc"]["_id"]);
                } catch (e) {
                    throw new Error("invalid parameter");
                }
            }
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }
    __inspect_2(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["target_doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (workPack["target_doc"]["_id"]) {
            if (!(workPack["target_doc"]["_id"] instanceof ObjectId)) {
                try {
                    workPack["target_doc"]["_id"] = new ObjectId(workPack["target_doc"]["_id"]);
                } catch (e) {
                    throw new Error("invalid parameter");
                }
            }
        }
        if (Object.prototype.toString.call(workPack["param"]) != "[object Object]") {
            workPack["param"] = {}
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }
    __inspect_3(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["target_doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (workPack["target_doc"]["_id"]) {
            if (!(workPack["target_doc"]["_id"] instanceof ObjectId)) {
                try {
                    workPack["target_doc"]["_id"] = new ObjectId(workPack["target_doc"]["_id"]);
                } catch (e) {
                    throw new Error("invalid parameter");
                }
            }
        }
        if (Object.prototype.toString.call(workPack["param"]) != "[object Object]") {
            workPack["param"] = {}
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }
    __inspect_4(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["pipeline"]) != "[object Array]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["param"]) != "[object Object]") {
            workPack["param"] = {}
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }
    __inspect_5(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["target_doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (workPack["target_doc"]["_id"]) {
            if (!(workPack["target_doc"]["_id"] instanceof ObjectId)) {
                try {
                    workPack["target_doc"]["_id"] = new ObjectId(workPack["target_doc"]["_id"]);
                } catch (e) {
                    throw new Error("invalid parameter");
                }
            }
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }
    __inspect_6(workPack) {
        if (Object.prototype.toString.call(workPack["collection"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
        if (Object.prototype.toString.call(workPack["target_doc"]) != "[object Object]") {
            throw new Error("invalid parameter");
        }
        if (workPack["target_doc"]["_id"]) {
            if (!(workPack["target_doc"]["_id"] instanceof ObjectId)) {
                try {
                    workPack["target_doc"]["_id"] = new ObjectId(workPack["target_doc"]["_id"]);
                } catch (e) {
                    throw new Error("invalid parameter");
                }
            }
        }
        if (Object.prototype.toString.call(workPack["param"]) != "[object Object]") {
            workPack["param"] = {}
        }
        if (Object.prototype.toString.call(workPack["db"]) != "[object String]") {
            throw new Error("invalid parameter");
        }
    }

    __workPack_inspect(workPack) {
        switch (workPack["method"]) {
            case METHODS.insertOne:
                this.__inspect_0(workPack);
                break;
            case METHODS.deleteOne:
                this.__inspect_1(workPack);
                break;
            case METHODS.findOne:
                this.__inspect_2(workPack);
                break;
            case METHODS.findOneAndUpdate:
                this.__inspect_3(workPack);
                break;
            case METHODS.aggregate:
                this.__inspect_4(workPack);
                break;
            case METHODS.deleteMany:
                this.__inspect_5(workPack);
                break;
            case METHODS.updateMany:
                this.__inspect_6(workPack);
                break;
            default:
                throw new Error("the workPack method is unknown!");
        }
    }
}

exports.DataLegalityChecker = DataLegalityChecker;

// convert config via default config
function _convert_config(default_config, config) {
    for (let key_1 of Object.keys(default_config)) {
        if (Object.prototype.toString.call(default_config[key_1]) == "[object Object]") {
            if (Object.prototype.toString.call(config[key_1]) == "[object Object]") {
                default_config[key_1] = _convert_config(_.defaults(config[key_1], default_config[key_1]), config[key_1]);
            } else if (!config[key_1]) {
                default_config[key_1] = _convert_config(_.defaults(config[key_1], default_config[key_1]), {});
            } else {
                default_config[key_1] = config[key_1];
            }
        }
        if (Object.prototype.toString.call(default_config[key_1]) == "[object Function]") {
            if (Object.prototype.toString.call(config[key_1]) == "[object Function]") {
                default_config[key_1] = config[key_1];
            }
        }
    }
    return default_config;
}

// init config of the database
exports.init_config = (config={}) => {
    if (Object.prototype.toString.call(config) == "[object Object]" || !config) {
        if (!_.isEmpty(config)) {
            return _convert_config(database_config_default, config);
        } else {
            return database_config_default;
        }
    } else {
        throw new Error("【config error】database config type should be Object!");
    }
}

// format the date
let date_format = (date) => {
    let _date = new Date(date);
    return `${_date.getFullYear()}-${_date.getMonth()+1}-${_date.getDate()} ${_date.getHours()<10?`0${_date.getHours()}`:_date.getHours()}:${_date.getMinutes()<10?`0${_date.getMinutes()}`:_date.getMinutes()}:${_date.getSeconds()<10?`0${_date.getSeconds()}`:_date.getSeconds()}`;
}
exports.date_format = date_format;


// error record message
exports.error_format = (date, content) => {
    let _content = `----------------------${date_format(date)}-------------------------------\n${content}`;
    return _content;
}

// class to record the time
class Timer_Record {
    constructor() {
        this._time_start = null;
        this._time_end = null;
    }

    start() {
        if (!this._time_end) {
            this._time_start = new Date().getTime();
        }
    }

    end() {
        if (this._time_start) {
            this._time_end = new Date().getTime();
            let _temp = this._time_end - this._time_start;
            this._time_start = null;
            this._time_end = null;
            return _temp
        }
    }

    reset() {
        this._time_start = null;
        this._time_end = null;
    }
}
exports.Timer_Record = Timer_Record;

// function to do something when query done
exports.query_done = (func, ...arg) => {
    if (func) {
        func(...arg);
    }
}