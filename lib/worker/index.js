const DAO = require("../basic/index");
const _ = require("underscore");

class Worker extends DAO{
    constructor(url, db, config){
        super(url, db, config);
        this.rule = {
            0: "insertOne",
            1: "deleteOne",
            2: "findOne",
            3: "findOneAndUpdate",
            4: "aggregate",
            5: "deleteMany",
            6: "updateMany"
        }
    }

    gen_query_statement(workList) {
        try {
            this.query_statement = [];
            for (let workPack of workList) {
                let _temp = `db.${workPack["collection"]}.${this.rule[workPack["method"]]}`;
                switch (workPack["method"]) {
                    case 0:
                        _temp += `(${JSON.stringify(workPack["doc"])})`;
                        break;
                    case 1:
                        _temp += `(${JSON.stringify(workPack["target_doc"])})`;
                        break;
                    case 2:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `(${JSON.stringify(workPack["target_doc"])})`;
                        }
                        break;
                    case 3:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])})`;
                        }
                        break;
                    case 4:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `(${JSON.stringify(workPack["pipeline"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `(${JSON.stringify(workPack["pipeline"])})`;
                        }
                        break;
                    case 5:
                        _temp += `(${JSON.stringify(workPack["target_doc"])})`;
                        break;
                    case 6:
                        if (workPack["param"] && !_.isEmpty(workPack["param"])) {
                            _temp += `(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])}, ${JSON.stringify(workPack["param"])})`;
                        } else {
                            _temp += `(${JSON.stringify(workPack["target_doc"])}, ${JSON.stringify(workPack["doc"])})`;
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