// database config default
let database = {
    // connection config
    connection: {
        useNewUrlParser: true,
        readPreference: "secondaryPreferred",
        readConcern: {
            level: "majority"
        }
    },
    // transaction config
    transaction: {
        readConcern: { level: 'majority' },
        writeConcern: { w: 1 }
    },
    // nayo config
    logging: default_record_logging
};

// default record logging function
function default_record_logging(process_time, query_statement) {
    query_statement.forEach((query, index) => {
        console.log(query);
    });
    console.log(`Execution Time: ${process_time}ms`);
}




module.exports = {
    database
}