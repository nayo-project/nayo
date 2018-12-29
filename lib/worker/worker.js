const DAO = require("../basic/index");



class Worker extends DAO{
    constructor(url, db){
        super(url, db);
    }
}

module.exports = Worker;