const DAO = require("../basic/index");
const _ = require("underscore");
const METHODS = require("./../main/methods");

class Worker extends DAO{
    constructor(url, db, config){
        super(url, db, config);
    }

    gen_query_statement(workList) {
        try {
            this.query_statement = [];
            for (let workPack of workList) {
                let _temp = `db.${workPack["collection"]}.`;
                switch (workPack["method"]) {
                    case METHODS.insertOne:
                        _temp += `${Object.keys(METHODS)[METHODS.insertOne]}(${JSON.stringify(workPack["doc"])})`;
                        break;
                    case METHODS.deleteOne:
                        _temp += `${Object.keys(METHODS)[METHODS.deleteOne]}(${JSON.stringify(workPack["target_doc"])})`;
                        break;
                    case METHODS.findOne:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `${Object.keys(METHODS)[METHODS.findOne]}(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `${Object.keys(METHODS)[METHODS.findOne]}(${JSON.stringify(workPack["target_doc"])})`;
                        }
                        break;
                    case METHODS.findOneAndUpdate:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `${Object.keys(METHODS)[METHODS.findOneAndUpdate]}(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `${Object.keys(METHODS)[METHODS.findOneAndUpdate]}(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])})`;
                        }
                        break;
                    case METHODS.aggregate:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `${Object.keys(METHODS)[METHODS.aggregate]}(${JSON.stringify(workPack["pipeline"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `${Object.keys(METHODS)[METHODS.aggregate]}(${JSON.stringify(workPack["pipeline"])})`;
                        }
                        break;
                    case METHODS.deleteMany:
                        _temp += `${Object.keys(METHODS)[METHODS.deleteMany]}(${JSON.stringify(workPack["target_doc"])})`;
                        break;
                    case METHODS.updateMany:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `${Object.keys(METHODS)[METHODS.updateMany]}(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `${Object.keys(METHODS)[METHODS.updateMany]}(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])})`;
                        }
                        break;
                }
                this.query_statement.push(_temp);
            }
        } catch (e) {
            throw new Error("the workPack struction is wrong, please to check!");
        }
    }
}

module.exports = Worker;