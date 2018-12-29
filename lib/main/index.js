const ObjectId = require("mongodb").ObjectId;
const EventEmitter = require("events");
const event = new EventEmitter();
const { ___method_behaviour, ___gen_connect_list, __convert_work, init_config } = require("../tool");
const Worker = require("../worker");

class nayo {
    constructor(options, config) {
        this.db_name = options.db;
        this.db_url = options.url;
        this.config = init_config(config);
        this.worker = new Worker(this.db_url, this.db_name, this.config);
        event.on("accept", (bag) => {
            this._accept(bag.workList, bag.workTool);
        });
        event.on("send_to_worker", (bag) => {
            this._work_selector(bag.workList, bag.workTool);
        });
        event.on("insert_one", (bag) => {
            this._insert_one(bag.workList, bag.workTool);
        });
        event.on("delete_one", (bag) => {
            this._delete_one(bag.workList, bag.workTool);
        });
        event.on("delete_many", (bag) => {
            this._delete_many(bag.workList, bag.workTool);
        });
        event.on("find_one", (bag) => {
            this._find_one(bag.workList, bag.workTool);
        });
        event.on("find_one_update", (bag) => {
            this._find_one_update(bag.workList, bag.workTool);
        });
        event.on("update_many", (bag) => {
            this._update_many(bag.workList, bag.workTool);
        });
        event.on("aggregate", (bag) => {
            this._aggregate(bag.workList, bag.workTool);
        });
        event.on("transaction", (bag) => {
            this._transaction(bag.workList, bag.workTool);
        });
        event.on("_ret_", (bag) => {
            this._send_ret(bag.workList, bag.workTool);
        });
    }

    // 内部处理
    // 使用方法1和3的任务目标是否存在
    // 使用aggregate进行联查
    //
    /*_is_pass(workList, TOOL) {
        return new Promise((resolve, reject) => {
            let _pipeline = [
                {
                    $project: {
                        _id: "db_check",
                    }
                }
            ];
            workList.forEach((item, index) => {
                if (item.method == 1 || item.method == 3 || item.method == 5 || item.method == 6) {
                    _pipeline = [..._pipeline, ...__gen_pipeline_work_for_is_pass(item, index)];
                }
            });
            let _work_list = [
                {
                    collection: "sys",
                    target_doc: null,
                    method: 4,
                    doc: null,
                    param: {},
                    pipeline: _pipeline
                }
            ];
            if (_pipeline.length > 1) {
                this._push_for_check(_work_list, TOOL).then(v => {
                    if (v.length == 0) {
                        reject("this doc is inoperable");
                    } else {
                        resolve(true);
                    }
                }).catch(e => {
                    reject(e);
                })
            } else {
                resolve(true);
            }
        });
    }*/

    // push用于检查
    _push_for_check(workList, TOOL) {
        return new Promise((resolve, reject) => {
            let bag = {
                workTool: TOOL,
                workList: [workList[0]]
            }
            event.emit("accept", bag);
            TOOL.ret_inner.then(v => {
                TOOL.ret_inner = null;
                resolve(v);
            }).catch(e => {
                reject(e);
            });
        });
    }

    _accept(workList, TOOL) {
        try {
            if (workList.length == 1) {
                let bag = {
                    workList: null,
                    workTool: TOOL
                }
                workList.forEach(work => {
                    bag.workList = work;
                    event.emit("send_to_worker", bag);
                });
            } else {
                let _err_list = [];
                workList.forEach((item, index) => {
                    // check the method number
                    // for transaction, the method should be limited, only for CUD, NO R
                    if (item.method != 0 && item.method != 1 && item.method != 3 && item.method != 5 && item.method != 6) {
                        _err_list.push(index);
                    }
                });
                if (_err_list.length == 0) {
                    this._transaction_process(workList, TOOL);
                } else {
                    TOOL.reject_inner(`the methods of the work_pack data are not allowed, please to check (illegal-data-position of work-list is ${_err_list.join()})`);
                }
            }
        } catch (e) {
            // 错误处理
            TOOL.reject_inner(e);
        }
    }

    _transaction_process(workList, TOOL) {
        try {
            let bag = {
                workList: __convert_work(workList, this.db_name),
                workTool: TOOL
            };
            event.emit("transaction", bag);
        } catch (e) {
            // 错误处理
            TOOL.reject_inner(e);
        }
    }

    _work_selector(work, TOOL) {
        let bag = {
            workList: work,
            workTool: TOOL
        }
        try {
            switch (work.method) {
                case 0:
                    event.emit("insert_one", bag);
                    break;
                case 1:
                    event.emit("delete_one", bag);
                    break;
                case 2:
                    event.emit("find_one", bag);
                    break;
                case 3:
                    event.emit("find_one_update", bag);
                    break;
                case 4:
                    event.emit("aggregate", bag);
                    break;
                case 5:
                    event.emit("delete_many", bag);
                    break;
                case 6:
                    event.emit("update_many", bag);
                    break;
                default:
                    TOOL.reject_inner(new Error("无效参数"));
            }
        } catch (e) {
            // 错误处理
            TOOL.reject_inner(e);
        }
    }

    //
    _insert_one(work, TOOL) {
        try {
            let work_temp = JSON.parse(JSON.stringify(work.doc));
            let bag = {
                workList: this.worker.insertOne(work_temp, work.collection),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _delete_one(work, TOOL) {
        try {
            let work_temp = JSON.parse(JSON.stringify(work.target_doc));
            let bag = {
                workList: this.worker.deleteOne(work_temp, work.collection),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _find_one(work, TOOL) {
        try {
            let target_doc_temp = JSON.parse(JSON.stringify(work.target_doc));
            let param_temp = JSON.parse(JSON.stringify(work.param));
            let bag = {
                workList: this.worker.findOne(target_doc_temp, work.collection, param_temp),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _find_one_update(work, TOOL) {
        try {
            let target_doc_temp = JSON.parse(JSON.stringify(work.target_doc));
            if (target_doc_temp._id) {
                target_doc_temp = {_id: new ObjectId(target_doc_temp._id)};
            }
            let doc_temp = JSON.parse(JSON.stringify(work.doc));
            let param_temp = JSON.parse(JSON.stringify(work.param));
            let bag = {
                workList: this.worker.findOneAndUpdate(target_doc_temp, doc_temp, work.collection, param_temp),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _aggregate(work, TOOL) {
        try {
            let pipeline = JSON.parse(JSON.stringify(work.pipeline));
            let param_temp = JSON.parse(JSON.stringify(work.param));
            let bag = {
                workList: this.worker.aggregate(pipeline, work.collection, param_temp),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _delete_many(work, TOOL) {
        try {
            let work_temp = JSON.parse(JSON.stringify(work.target_doc));
            let bag = {
                workList: this.worker.deleteMany(work_temp, work.collection),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _update_many(work, TOOL) {
        try {
            let target_doc_temp = JSON.parse(JSON.stringify(work.target_doc));
            if (target_doc_temp._id) {
                target_doc_temp = {_id: new ObjectId(target_doc_temp._id)};
            }
            let doc_temp = JSON.parse(JSON.stringify(work.doc));
            let param_temp = JSON.parse(JSON.stringify(work.param));
            let bag = {
                workList: this.worker.updateMany(target_doc_temp, doc_temp, work.collection, param_temp),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    _transaction(work, TOOL) {
        try {
            let bag = {
                workList: this.worker.transaction(work),
                workTool: TOOL
            }
            event.emit("_ret_", bag);
        } catch (e) {
            TOOL.reject_inner(e);
        }
    }

    // final result
    _send_ret(pro, TOOL) {
        TOOL.ret_inner = pro;
    }

    // out
    push(workList) {
        return new Promise((resolve, reject) => {
            try {
                // should create new address to save Object, avoiding data pollution
                let _workList_temp = JSON.parse(JSON.stringify(workList));
                // the way of avoiding the conflict by creating a new memory address while using 'push'
                let _workTool = {
                    workList_inner: _workList_temp,
                    reject_inner: reject,
                    push_resove_inner: resolve,
                    ret_inner: null
                };
                if (_workTool.workList_inner.length < 1) {
                    throw new Error("invalid parameter");
                }
                let _bag = {workList, _workTool};
                event.emit("accept", _bag);
                resolve(_workTool.ret_inner);
                /*this._is_pass(workTool.workList_inner, workTool).then(v => {
                    let bag = {workList, workTool};
                    event.emit("accept", bag);
                    resolve(workTool.ret_inner);
                }).catch(e => {
                    reject(e);
                });*/
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = nayo;