![nayo](https://raw.githubusercontent.com/Terencesun/nayo/master-python/logo.jpg)


![](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)
![](https://img.shields.io/npm/v/nayo.svg)
![](https://img.shields.io/node/v/carbon.svg)
![](https://img.shields.io/badge/mongoDB%20version-%3E%3D4.x.x-brightgreen.svg)
![](https://travis-ci.com/Terencesun/nayo.svg?branch=master)
![](https://img.shields.io/github/languages/top/Terencesun/nayo.svg)
![](https://img.shields.io/github/license/Terencesun/nayo.svg)
![](https://img.shields.io/github/last-commit/Terencesun/nayo.svg)
![](https://img.shields.io/github/stars/Terencesun/nayo.svg?label=Stars&style=social)

#### the simple operation interface for mongoDB by nodejs 
---
### Update Log
- add the config "logging" so that you can customize your logging method
### To do
- will add python version, please give me some time :)
---
### 1.Introduction
Nayo is a simple operation interfaces based on the workList-workPack conceptual design.

You can use the simple workList to operate the MongoDB, and the workList is easy to be created.

### 2.What is the workList and workPack?
In Nayo, workList is the array, and workPack is the json;

just like this
```
[
    {
        collection: "test",
        target_doc: {"test": "test"},
        method: 0,
        doc: null,
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: {"test": "test"},
        method: 0,
        doc: null,
        param: {},
        pipeline: null
    }
]
```

before you use the Nayo, you should learn the operations of MongoDB, [here the doc of MongoDB](https://docs.mongodb.com/)

the workList has two workPack, mongoDB can execute the task via every workPack.

if you have only one task, you should let the workList contain this task,

just like this
```
[
    {
        collection: "test",
        target_doc: {"test": "test"},
        method: 0,
        doc: null,
        param: {},
        pipeline: null
    }
]
```

when the workList's length is above 1, like 2, 3, or more, nayo can translate the workList to transaction.

so, let me tell you about the workPack,

every workPack is a json, just like this

```
{
    collection: "test",
    target_doc: {"test": "test"},
    method: 0,
    doc: null,
    param: {},
    pipeline: null
}
```

- collection: the collection name of db, it should be required
- target_doc: if the method have the target document, you should write this, the query is same as the orignal operation, like {xxx: xxx} in db.test.find({xxx: xxx}); if the method haven't the traget document, you should set the target_doc to null
- method: the number of operation method:
  - insertOne ---> 0
  - deleteOne ---> 1
  - findOne ---> 2
  - findOneAndUpdate ---> 3
  - aggregate ---> 4
  - deleteMany ---> 5
  - updateMany ---> 6
- doc: if the method has some document to update or create, you should write this, the query is same as the orignal operation, like {$set: {"xxx": "xxx"}} in db.test.insertOne({$set: {"xxx": "xxx"}}); if the method haven't the doc, you should set the target_doc to null
- param: if the orignal operation have the parameter option, you can wirte the param, like "limit", "sort" and so on. by the way, the param should be {} if you don't write it
- pipeline: if the method is aggregate, here is the place to write the pipeline, the way is same as the orignal, you can see [the doc of aggregate](https://docs.mongodb.com/manual/aggregation/), if you don't use the pipeline, you should set it to null

**Notice: the method "aggregate" only support the method "insertOne", "deleteOne", "deleteMany", "updateMany", if you have some great ideas you can commit the issue, I'm so glad to know more ways to promote NAYO**

[Here is the doc](https://docs.mongodb.com/manual/crud/), you can learn about the orignal operation CURD in detail.

In the end, **All attributes of the workPack should not be discarded**.

OK, all these are about the introduction of the workList and workPack, if you still have question, you can commit issue for help.

### 3.Install
```
npm install nayo --save
```

or download this repo to use

### 4.Examples
**you can find how to write the options and the config**
```
const NAYO = require("nayo");

// init NAYO
// here is two params, options and config

let options = {
    url: "xxx", // mongodb url
    db: "yyy"   // db's name
}

/*
default config
config = {
    connection: {
        useNewUrlParser: true,
        readPreference: "secondaryPreferred",
        readConcern: {
            level: "majority"
        }
    },
    transaction: {
        readConcern: { level: 'majority' },
        writeConcern: { w: 1 }
    },
    logging: Function-name
}
*/
let logging_function = (process_time, query_statement) => {
    // do something
    // if you don't write your function, the default function will work
    // this function has two argument, you can use it
    // process_time ----> the process's execution time(ms)
    // query_statement ----> the command sentence which can use on the MongoShell, btw, the query_statement is an Array
}

let config = {  // this is the mongoDB connection and transaction config
                // see http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html for connection config infomation
                // see https://docs.mongodb.com/manual/core/transactions/#transaction-options-read-concern-write-concern-read-preference for transaction config infomation
    connection: {
        /**/
    },
    transaction: {
        /**/
    },
    logging: logging_function     // don't write the function, should write function name
}
const nayo = new NAYO(options, config);

// arrange the workList and workPack
let workList = [
    {
        collection: "test",
        target_doc: null,
        method: 0, // insertOne
        doc: { "test": "test" },
        param: {},
        pipeline: null
    }
];

// do the work
nayo.push(workList).then(res => { // if it works successfully, we will get res
    console.log(res);
}).catch(err => {   // if error, we will get err
    console.log(err);
});

// done
```

### 5.Method

#### push(workList) 
##### return Promise
###### push the workList to translate and do the task in MongoDB, please check the sample to find how to use it 

#### authenticate()
##### return Promise
###### check if the connection is successful
```
nayo.authenticate().then(ret => {
    console.log(ret)            // successful, will return "Connect Success"
}).catch(e => {
    console.log(e)              // occur error or fail, will return the error or "Connect Fail"
});
```
### 6.License

This library is published under the MIT license. See LICENSE for details.

### 7.Reference

- [MongoDB manual](https://docs.mongodb.com/manual/)
- [MongoDB Node api](http://mongodb.github.io/node-mongodb-native/3.1/api/)
