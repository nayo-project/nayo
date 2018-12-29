// transaction help function
exports.___method_behaviour = (work_item, index) => {
    let _target_item;
    let _param;
    let _work_item;
    let _sentence;
    switch (work_pack.method) {
        case 0:
            _work_item = work_pack.doc;
            _sentence = `_connect[${index}].insertOne(${JSON.stringify(_work_item)}, { session });`;
            break;
        case 1:
            _target_item = work_pack.target_doc;
            _sentence = `_connect[${index}].deleteOne(${JSON.stringify(_target_item)}, { session });`;
            break;
        case 3:
            _param = work_pack.param;
            _target_item = work_pack.target_doc;
            _work_item = work_pack.doc;
            _sentence = `_connect[${index}].findOneAndUpdate(${JSON.stringify(_target_item)}, ${JSON.stringify(_work_item)}, ${JSON.stringify({
                ..._param,
                replace_item: "replace_item"
            }).replace('"replace_item":"replace_item"', 'session')});`;
            break;
        case 5:
            _target_item = work_pack.target_doc;
            _sentence = `_connect[${index}].deleteMany(${JSON.stringify(_target_item)}, { session });`;
            break;
        case 6:
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

exports.___gen_connect_list = (work_pack, db_name, index) => {
    return `client.db("${db_name}").collection("${work_pack.collection}");`;
}

exports.__convert_work = (work_list, dbname) => {
    let _list_connect = [];
    let _list_do = [];
    work_list.forEach((item, index) => {
        _list_connect.push(___gen_connect_list(item, dbname, index));
        _list_do.push(___method_behaviour(item, index));
    });
    return [
        _list_connect,
        _list_do
    ];
}