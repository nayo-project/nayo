// 方法Map
const MAP = {
    0: "insertOne",
    1: "deleteOne",
    2: "findOne",
    3: "findOneAndUpdate",
    4: "aggregate",
    transaction: "transaction"
}

// 数据库位置
const database = {
    // 数据库连接配置
    connection_config: {
        authMechanism: "MDEFAULT",
        useNewUrlParser: true,
        replicaSet: 'SGF',
        readPreference: "secondaryPreferred",
        readConcern: {
            level: "majority"
        }
    },
    // 事务配置
    transaction_config: {
        readConcern: { level: 'majority' },
        writeConcern: { w: 1 }
    }
};




module.exports = {
    MAP,
    database,
}