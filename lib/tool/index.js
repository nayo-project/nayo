let database_config_default = require("../config").database;
let _ = require("underscore");


// transaction help function
let ___method_behaviour = (work_pack, index, nayo) => {
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
            _sentence = `_connect[${index}].insertOne(${JSON.stringify(_work_item)}, { session });`;
            break;
        case 1:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(1);
            }
            _target_item = work_pack.target_doc;
            _sentence = `_connect[${index}].deleteOne(${JSON.stringify(_target_item)}, { session });`;
            break;
        case 3:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(3);
            }
            _param = work_pack.param;
            _target_item = work_pack.target_doc;
            _work_item = work_pack.doc;
            _sentence = `_connect[${index}].findOneAndUpdate(${JSON.stringify(_target_item)}, ${JSON.stringify(_work_item)}, ${JSON.stringify({
                ..._param,
                replace_item: "replace_item"
            }).replace('"replace_item":"replace_item"', 'session')});`;
            break;
        case 5:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(5);
            }
            _target_item = work_pack.target_doc;
            _sentence = `_connect[${index}].deleteMany(${JSON.stringify(_target_item)}, { session });`;
            break;
        case 6:
            if (process.env.nayo == "test") {
                nayo.test_methods_arr.push(6);
            }
            _param = work_pack.param;
            _target_item = work_pack.target_doc;
            _work_item = work_pack.doc;
            _sentence = `_connect[${index}].updateMany(${JSON.stringify(_target_item)}, ${JSON.stringify(_work_item)}, ${JSON.stringify({
                ..._param,
                replace_item: "replace_item"
            }).replace('"replace_item":"replace_item"', 'session')});`;
            break;
    }
    return _sentence;
}

let ___gen_connect_list = (work_pack, db_name, index, nayo) => {
    return `client.db("${db_name}").collection("${work_pack.collection}");`;
}

exports.__convert_work = (work_list, dbname, nayo) => {
    let _list_connect = [];
    let _list_do = [];
    work_list.forEach((item, index) => {
        _list_connect.push(___gen_connect_list(item, dbname, index, nayo));
        _list_do.push(___method_behaviour(item, index, nayo));
    });
    return [
        _list_connect,
        _list_do
    ];
}

exports.init_config = (config) => {
    if (Object.prototype.toString.call(config) == "[object Object]" || !config) {
        if (!_.isEmpty(config)) {
            return config;
        } else {
            return database_config_default;
        }
    } else {
        throw new Error("【config error】database config type should be Object!");
    }
}