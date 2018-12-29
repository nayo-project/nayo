const Management = require("./management");


class Factory {
    constructor(options){
        this.manage = new Management(options);
    }
}

module.exports = Factory;