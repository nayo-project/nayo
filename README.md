![nayo](https://raw.githubusercontent.com/Terencesun/nayo/master-nodejs/logo.jpg)


![](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)
![](https://img.shields.io/npm/v/nayo.svg)
![](https://img.shields.io/badge/node-%3E%3D8.5.0-brightgreen.svg)
![](https://img.shields.io/badge/mongoDB%20version-%3E%3D4.x.x-brightgreen.svg)
![](https://img.shields.io/github/languages/top/Terencesun/nayo.svg)
![](https://img.shields.io/github/license/Terencesun/nayo.svg)
![](https://img.shields.io/github/last-commit/Terencesun/nayo.svg)
![](https://img.shields.io/github/stars/Terencesun/nayo.svg?label=Stars&style=social)

#### the simple operation interface for mongoDB by nodejs 
---
### Update Log
- export the ObjectId class, and you can use it to find the document via ObjectId
- optimizing code structure and stability improved
- workPack and nayo options add new optional attribute 【db】，it will work only in the transaction, and you can do the cross library transactions,btw, the optional attribute 【db】 will be required in nayo 2.0.0 and then you can operate the multiple database in mongodb
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
        db: {  // optional
            name: "test_database"
        },
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
    db: {  // optional
        name: "test_database"
    },
    collection: "test",
    target_doc: {"test": "test"},
    method: 0,
    doc: null,
    param: {},
    pipeline: null
}
```
- db: optional, it is the object contain the 【name】 only, only work in transaction,if you set it wrong, nayo will throw error, if you don's set this, the transaction will use the default db when you config the nayo:
  - name: the db's name, **The database must exist, otherwise it will not work properly!**
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

**Notice: the method "transaction" only support the method "insertOne", "deleteOne", "findOneAndUpdate", "deleteMany", "updateMany", if you have some great ideas you can commit the issue, I'm so glad to know more ways to promote NAYO**

[Here is the doc](https://docs.mongodb.com/manual/crud/), you can learn about the orignal operation CURD in detail.

In the end, **All attributes except the 【db】 of the workPack should not be discarded**.

OK, all these are about the introduction of the workList and workPack, if you still have question, you can commit issue for help.

### 3.Install
```
npm install nayo --save
```

or download this repo to use

### 4.Examples
**you can find how to write the options and the config**
```
const Nayo = require("nayo");

// init NAYO
// here is two params, options and config

let options = {
    // mongodb url
    url: "xxx",
    // default db's options
    // db is object, shoul contain the db's name, like below
    // db is same as the workPack's db
    db: {
       name: "yyy" 
    }
}

/*
default config
config = {
    connection: {
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
const nayo = new Nayo(options, config);

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

// transaction workList
// when the workList has 2 or more workPack, the transaction will auto be used
// but nayo transaction only support the method "insertOne", "deleteOne", "findOneAndUpdate", "deleteMany", "updateMany" now
let workList_transaction = [
    {
        db: {
            name: "test_database"
        },
        collection: "test",
        target_doc: null,
        method: 0, // insertOne
        doc: { "test": "test" },
        param: {},
        pipeline: null
    },
    {
        collection: "test",
        target_doc: null,
        method: 0, // insertOne
        doc: { "test": "test" },
        param: {},
        pipeline: null
    },
    ...
]

// do the work
nayo.push(workList).then(res => { // if it works successfully, we will get res
    console.log(res);
}).catch(err => {   // if error, we will get err
    console.log(err);
});

// done
```
### 5.Class
- **Nayo(options, config)**

the main class of nayo, you can use it by **new Nayo(options, config)** to generate a instance **nayo**
, you can see the 4.Example to see the options and config's introduce
- **ReadPerence**
 
this class is same as mongodb
you can see more to learn about it, [click here](http://mongodb.github.io/node-mongodb-native/2.0/api/ReadPreference.html)

```
// how to require ReadPerence
// Example:
const ReadPerence = require(nayo).ReadPerence
```

- **ObjectId**
 
this class is same as mongodb
you can see more to learn about it, [click here](https://docs.mongodb.com/manual/reference/method/ObjectId/index.html)

```
// how to require ObjectId
// Example:
const ObjectId = require(nayo).ObjectId
```
### 6.Method
#### nayo.push(workList) 
##### return \<Promise>
###### push the workList to translate and do the task in MongoDB, please check the sample to find how to use it 

#### nayo.authenticate()
##### return \<Promise>
###### check if the connection is successful
```
nayo.authenticate().then(ret => {
    console.log(ret)            // successful, will return "Connect Success"
}).catch(e => {
    console.log(e)              // occur error or fail, will return the error or "Connect Fail"
});
```

### 7.License

This library is published under the MIT license. See LICENSE for details.

### 8.Reference

- [MongoDB manual](https://docs.mongodb.com/manual/)
- [MongoDB Node api](http://mongodb.github.io/node-mongodb-native/3.1/api/)
