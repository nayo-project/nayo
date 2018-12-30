// props name
exports.db_name = Symbol("db_name");
exports.db_url = Symbol("db_url");
exports.config_symbol = Symbol("config");
exports.worker = Symbol("worker");

// symbol methods name
exports._accept = Symbol("_accept");
exports._transaction_process = Symbol("_transaction_process");
exports._work_selector = Symbol("_work_selector");
exports._insert_one = Symbol("_insert_one");
exports._delete_one = Symbol("_delete_one");
exports._delete_many = Symbol("_delete_many");
exports._aggregate = Symbol("_aggregate");
exports._find_one = Symbol("_find_one");
exports._find_one_update = Symbol("_find_one_update");
exports._update_many = Symbol("_update_many");
exports._transaction = Symbol("_transaction");
exports._send_ret = Symbol("_send_ret");