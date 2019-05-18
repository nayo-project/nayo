let database_config_default = require("../config").database;
let _ = require("underscore");


// transaction help function
let ___method_behaviour = (work_pack, index, nayo, connect) => {
    let _target_item;
    let _param;
    let _work_item;
    let _sentence;
    switch (work_pack.method) {
        case 0:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(0);
            }
            _work_item = work_pack.doc;
            _sentence = `${connect}.insertOne(${JSON.stringify(_work_item)}, { "session": session });`;
            break;
        case 1:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(1);
            }
            _target_item = work_pack.target_doc;
            _sentence = `${connect}.deleteOne(${JSON.stringify(_target_item)}, { "session": session });`;
            break;
        case 3:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(3);
            }
            _param = work_pack.param;
            _target_item = work_pack.target_doc;
            _work_item = work_pack.doc;
            _sentence = `${connect}.findOneAndUpdate(${JSON.stringify(_target_item)}, ${JSON.stringify(_work_item)}, ${JSON.stringify({
                ..._param,
                replace_item: "replace_item"
            }).replace('"replace_item":"replace_item"', '"session": session')});`;
            break;
        case 5:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(5);
            }
            _target_item = work_pack.target_doc;
            _sentence = `${connect}.deleteMany(${JSON.stringify(_target_item)}, { "session": session });`;
            break;
        case 6:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(6);
            }
            _param = work_pack.param;
            _target_item = work_pack.target_doc;
            _work_item = work_pack.doc;
            _sentence = `${connect}.updateMany(${JSON.stringify(_target_item)}, ${JSON.stringify(_work_item)}, ${JSON.stringify({
                ..._param,
                replace_item: "replace_item"
            }).replace('"replace_item":"replace_item"', '"session": session')});`;
            break;
    }
    return _sentence;
}

let ___gen_connect_list = (work_pack, db_name, index, nayo) => {
    return `client.db("${db_name}").collection("${work_pack.collection}")`;
}

exports.__convert_work = (work_list, dbname, nayo) => {
    let _list_do = [];
    for (let index in work_list) {
        let item = work_list[index];
        _list_do.push(___method_behaviour(item, index, nayo, ___gen_connect_list(item, dbname, index, nayo)));
    }
    return _list_do;
}

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