// options test
exports.test_options = {
    url: "test",
    db: "test"
}

// 0
exports.data_0 = [
    {
        collection: "test",
        target_doc: null,
        method: 0,
        doc: { "test": "test" },
        param: {},
        pipeline: null
    }
]

// 1
exports.data_1 = [
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 1,
        doc: null,
        param: {},
        pipeline: null
    }
]

// 2
exports.data_2 = [
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 2,
        doc: null,
        param: {},
        pipeline: null
    }
]

// 3
exports.data_3 = [
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 3,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    }
]

// 4
exports.data_4 = [
    {
        collection: "test",
        target_doc: null,
        method: 4,
        doc: null,
        param: {},
        pipeline: [
            {
                $match: {
                    "test": "test"
                }
            }
        ]
    }
]

// 5
exports.data_5 = [
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 5,
        doc: null,
        param: {},
        pipeline: null
    }
]

// 6
exports.data_6 = [
    {
        collection: "test",
        target_doc: { $eq: { "test": "test" } },
        method: 6,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    }
]

// transaction
exports.data_transaction = [
    {
        collection: "test",
        target_doc: null,
        method: 0,
        doc: { "test": "nayo" },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 1,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 3,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 5,
        doc: null,
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 6,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    }
]

// transaction method error
exports.data_transaction_method_error = [
    {
        collection: "test",
        target_doc: null,
        method: 0,
        doc: { "test": "nayo" },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 1,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 3,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 2,
        doc: null,
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: { "test": "test" },
        method: 6,
        doc: { $set: { "test": "nayo" } },
        param: {},
        pipeline: null
    }
]