const DAO = require("../basic/index");

class Worker extends DAO{
    constructor(url, db, config){
        super(url, db, config);
    }
}

module.exports = Worker;