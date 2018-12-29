/**
 * @name BASIC-DAO config
 * @version v1.0.0
 * @author terence
 * @time` 2018/12/26  13:55
*/
const CONF = require("./../config/manage-config");

// db connection config
const connection_config = CONF.database.connection_config;

// transaction config
const transaction_config = CONF.database.transaction_config;


module.exports = {
    connection_config,
    transaction_config,
}