![nayo](https://raw.githubusercontent.com/Terencesun/nayo/master-nodejs/logo.jpg)


![](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)
![](https://img.shields.io/badge/mongoDB%20version-%3E%3D4.x.x-brightgreen.svg)
![](https://img.shields.io/badge/python-%3E%3D3.6-brightgreen.svg)
![](https://img.shields.io/github/license/Terencesun/nayo.svg)
![](https://img.shields.io/github/last-commit/Terencesun/nayo.svg)
![](https://img.shields.io/github/stars/Terencesun/nayo.svg?label=Stars&style=social)

#### The simple operation interface for mongoDB by Nodejs and Python
---
### Update Log
- the version 2.0.0 add the python version
- update the workPack and the options while initing the Nayo

### nayo-project
Here are other projects in nayo-project, if it help u welcome to **star this project**~ thx~

- nayo-mongo --> [link](https://github.com/nayo-project/nayo)
- nayo-admin-core --> [link](https://github.com/nayo-project/nayo-admin-core)
- nayo-admin --> [link](https://github.com/nayo-project/nayo-admin)
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
        "db": "test",
        "collection": "test",
        "target_doc": {"test": "test"},
        "method": 0,
        "doc": None,
        "param": None,
        "pipeline": None
    },
    {
        "db": "test",
        "collection": "test",
        "target_doc": {"test": "test"},
        "method": 0,
        "doc": None,
        "param": None,
        "pipeline": None
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
        "db": "test",
        "collection": "test",
        "target_doc": {"test": "test"},
        "method": 0,
        "doc": None,
        "param": None,
        "pipeline": None
    }
]
```

when the workList's length is above 1, like 2, 3, or more, nayo can translate the workList to transaction.

so, let me tell you about the workPack,

every workPack is a json, just like this

```
{
    "db": "test",
    "collection": "test",
    "target_doc": {"test": "test"},
    "method": 0,
    "doc": None,
    "param": None,
    "pipeline": None
}
```
- db: the workPack will do in this db, if you set it wrong, nayo will throw error
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
- param: if the orignal operation have the parameter option, you can wirte the param, like "limit", "sort" and so on. by the way, the param should be None if you don't write it
- pipeline: if the method is aggregate, here is the place to write the pipeline, the way is same as the orignal, you can see [the doc of aggregate](https://docs.mongodb.com/manual/aggregation/), if you don't use the pipeline, you should set it to null

**Notice: the method "transaction" only support the method "insertOne", "deleteOne", "findOneAndUpdate", "deleteMany", "updateMany", if you have some great ideas you can commit the issue, I'm so glad to know more ways to promote NAYO**

[Here is the doc](https://docs.mongodb.com/manual/crud/), you can learn about the orignal operation CURD in detail.

OK, all these are about the introduction of the workList and workPack, if you still have question, you can commit issue for help.

### 3.Install
```
pip install nayo
```

or download this repo to use

### 4.Examples
**you can find how to write the options and the config**
```
from nayo import Nayo
# here is others that you can import
# from nayo import read_preferences
# from nayo import read_concern
# from nayo import write_concern
# from nayo import ObjectId

# init NAYO
# here is two params, options and config

options = {
    "url": "xxx"  # mongodb url
}


# default config
# config = {
#     "connection": {
#         "readPreference": "secondaryPreferred",
#         "readConcernLevel": "majority"
#     },
#     "transaction": {
#         read_concern: { "level": "majority" },
#         write_concern: { "w": 1 }
#     },
#     "logging": Function-name
# }

def logging_function(process_time, query_statement):
    # do something
    # if you don't write your function, the default function will work
    # this function has two argument, you can use it
    # process_time ----> the process's execution time(ms)
    # query_statement ----> the command sentence which can use on the MongoShell, btw, the query_statement is an Array
    pass

config = {  # this is the mongoDB connection and transaction config
                # see http://api.mongodb.com/python/current/api/pymongo/mongo_client.html for connection config infomation
                # see https://docs.mongodb.com/manual/core/transactions/#transaction-options-read-concern-write-concern-read-preference for transaction config infomation
    "connection": {
        ...
    },
    "transaction": {
        ...
    },
    "logging": logging_function     # don't write the function, should write function name
}

nayo = Nayo(options, config)

# arrange the workList and workPack
workList = [
    {
        "db": "test",
        "collection": "test",
        "target_doc": None,
        "method": 0, # insertOne
        "doc": { "test": "test" },
        "param": None,
        "pipeline": None
    }
];

# transaction workList
# when the workList has 2 or more workPack, the transaction will auto be used
# but nayo transaction only support the method "insertOne", "deleteOne", "findOneAndUpdate", "deleteMany", "updateMany" now
workList_transaction = [
    {
        "db": "test",
        "collection": "test",
        "target_doc": None,
        "method": 0, # insertOne
        "doc": { "test": "test" },
        "param": None,
        "pipeline": None
    },
    {
        "db": "test_1",
        "collection": "test",
        "target_doc": { "test": "test" },
        "method": 3, # updateOne
        "doc": { "$set": { "test_1": 123 } },
        "param": None,
        "pipeline": None
    },
    ...
]

// do the work
nayo.push(workList)

// done
```
### 5.Class
- **Nayo(options, config)**

the main class of nayo, you can use it by **Nayo(options, config)** to generate a instance **nayo**
, you can see the 4.Example to see the options and config's introduce
- **read_preferences**
 
this class is same as mongodb
you can see more to learn about it, [click here](http://api.mongodb.com/python/current/api/pymongo/read_preferences.html#pymongo.read_preferences.ReadPreference)

```
// how to import read_preferences
// Example:
from nayo import read_preferences
```

- **read_concern**
 
this class is same as mongodb
you can see more to learn about it, [click here](http://api.mongodb.com/python/current/api/pymongo/read_concern.html#pymongo.read_concern.ReadConcern)

```
// how to import read_concern
// Example:
from nayo import read_concern
```

- **write_concern**
 
this class is same as mongodb
you can see more to learn about it, [click here](http://api.mongodb.com/python/current/api/pymongo/write_concern.html#pymongo.write_concern.WriteConcern)

```
// how to import write_concern
// Example:
from nayo import write_concern
```

- **ObjectId**
 
this class is same as mongodb
you can see more to learn about it, [click here](https://docs.mongodb.com/manual/reference/method/ObjectId/index.html)

```
// how to import ObjectId
// Example:
from nayo import ObjectId
```
### 6.Method
#### nayo.push(workList) 
##### return \<Promise>
###### push the workList to translate and do the task in MongoDB, please check the sample to find how to use it 

### 7.MongoClient
if you init Nayo class，you can use this below to get the MongoClient instance to do some other work
```
nayo = Nayo(options, config)

# MongoClient (the client state is connected)
# http://api.mongodb.com/python/current/api/pymongo/mongo_client.html
MongoClient = nayo.client
```

### 8.License

This library is published under the MIT license. See LICENSE for details.

### 9.Reference

- [MongoDB manual](https://docs.mongodb.com/manual/)
- [MongoDB Python api](http://api.mongodb.com/python/current/api/index.html)
