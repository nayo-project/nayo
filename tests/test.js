const should = require("should");
const { test_options, data_0, data_1, data_2, data_3, data_4, data_5, data_6, data_transaction, data_transaction_method_error } = require("./testData");
const NAYO = require("./../index");

describe("test new NAYO", () => {
    it('nayo build pass (￣▽￣)／', () => {
        let nayo = new NAYO(test_options);
        let db_name = nayo.db_name;
        let db_url = nayo.db_url;
        db_name.should.equal("test");
        db_url.should.equal("test");
    });
});

describe("test method 0", () => {
    it('method 0 check pass (～￣▽￣)～  ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_0).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(0);
            done();
        }).catch(e => {
            done(e);
        })
    });
});

describe("test method 1", () => {
    it('method 1 check pass (oﾟ▽ﾟ)o    ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_1).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(1);
            done();
        }).catch(e => {
            done(e);
        })
    });
});

describe("test method 2", () => {
    it('method 2 check pass ٩(๑❛ᴗ❛๑)۶    ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_2).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(2);
            done();
        }).catch(e => {
            done(e)
        })
    });
});

describe("test method 3", () => {
    it('method 3 check pass ٩(๑>◡<๑)۶     ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_3).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(3);
            done();
        }).catch(e => {
            done(e)
        })
    });
});

describe("test method 4", () => {
    it('method 4 check pass []~(￣▽￣)~*    ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_4).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(4);
            done();
        }).catch(e => {
            done(e)
        })
    });
});

describe("test method 5", () => {
    it('method 5 check pass (￣▽￣)~*    ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_5).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(5);
            done();
        }).catch(e => {
            done(e)
        })
    });
});

describe("test method 6", () => {
    it('method 6 check pass ヾ(^Д^*)/    ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_6).then(res => {
            let num = nayo.test_methods_arr[0];
            num.should.equal(6);
            done();
        }).catch(e => {
            done(e)
        })
    });
});

describe("test transaction", () => {
    it('transaction check pass (๑¯∀¯๑)   ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_transaction).then(res => {
            nayo.test_methods_arr.forEach((item, index) => {
                if (index != nayo.test_methods_arr.length-1) {
                    item.should.equal(data_transaction[index].method);
                } else {
                    item.should.equal("transaction");
                }
            });
            done();
        }).catch(e => {
            done(e)
        })
    });
});

describe("test transaction method error", () => {
    it('transaction method error check pass ✺◟(∗❛ัᴗ❛ั∗)◞✺   ', (done) => {
        let nayo = new NAYO(test_options);
        nayo.push(data_transaction_method_error).then(res => {
            done(new Error("error"));
        }).catch(e => {
            if (e.name == "transaction method type error") {
                done()
            } else {
                done(new Error("error"));
            }
        })
    });
});