"""
Created on 2019/5/11
@author: Terence.Sun
@email: terence@segofun.com
"""
from nayo.worker import Worker
from nayo.config import database as default_database
from nayo.tool import init_config
from nayo.tool import dataLegalityChecker
from nayo.main.methods import METHODS
from bson.objectid import ObjectId

# pymongo config
# MongoClient config is below:
# http://api.mongodb.com/python/current/api/pymongo/mongo_client.html
# MongoClient transaction config is below:
# http://api.mongodb.com/python/current/api/pymongo/client_session.html#pymongo.client_session.TransactionOptions
class Nayo:

    def __init__(self, options, config={}):
        self.__db_url = options["url"]
        self.__config = init_config(default_database, config)
        self.__worker_handler = {
            METHODS["insertOne"]: self.__insertOne,
            METHODS["deleteOne"]: self.__deleteOne,
            METHODS["findOne"]: self.__findOne,
            METHODS["findOneAndUpdate"]: self.__findOneAndUpdate,
            METHODS["aggregate"]: self.__aggregate,
            METHODS["deleteMany"]: self.__deleteMany,
            METHODS["updateMany"]: self.__updateMany
        }
        self.__worker = Worker(self.__db_url, self.__config)
        # export client
        self.client = self.__worker.client



    def __insertOne(self, workPack, db):
        """
        insert one data to database
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.insert_one(workPack["doc"], workPack["collection"], db)

    def __deleteOne(self, workPack, db):
        """
        delete one data from database
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.delete_one(workPack["target_doc"], workPack["collection"], db)

    def __findOne(self, workPack, db):
        """
        find one data from database
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.find_one(workPack["target_doc"], workPack["collection"], workPack["param"], db)

    def __findOneAndUpdate(self, workPack, db):
        """
        find and update one data from database
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.find_one_and_update(workPack["target_doc"], workPack["doc"], workPack["collection"], workPack["param"], db)

    def __aggregate(self, workPack, db):
        """
        aggregation
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.aggregate(workPack["pipeline"], workPack["collection"], workPack["param"], db)

    def __deleteMany(self, workPack, db):
        """
        delete more data from database
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.delete_many(workPack["target_doc"], workPack["collection"], db)

    def __updateMany(self, workPack, db):
        """
        update more data from database
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        return self.__worker.update_many(workPack["target_doc"], workPack["doc"], workPack["collection"], workPack["param"], db)

    def __send_to_worker(self, workPack):
        """
        distribute the workPack to a certain worker handler
        :param workPack: the list contain the workPack
        :return: return workResult  - the message that worker returned
        """
        try:
            if not isinstance(workPack, dict):
                raise TypeError("the workPack should be Dict!")
            method = workPack.get("method")
            if method == None:
                raise ValueError("the workPack should have the attribute - method to let nayo know what you want to do.")
            if method not in self.__worker_handler.keys():
                raise ValueError(f"the method of the workPack {workPack} is not contained at nayo worker.")
            return self.__worker_handler[method](workPack, db=workPack.get("db", None))
        except BaseException as info:
            raise info

    def __transaction_process(self, workList):
        """
        begin transaction process
        :param workList: the list contain the workPack
        :return: workResult  - the message that worker returned
        """
        _work_sentence_list = []
        for workPack in workList:
            _work_sentence_list.append(self.__send_to_worker(workPack))
        return self.__worker.transaction(_work_sentence_list)

    def __accept(self, workList):
        """
        to distribute the work
        :param workList: the list contain the workPack
        :return: workResult  - the message that worker returned
        """
        if len(workList) == 1:
            self.__worker.mode = "normal"
            workPack = workList[0]
            return self.__send_to_worker(workPack)
        else:
            self.__worker.mode = "transaction"
            return self.__transaction_process(workList)

    def push(self, workList):
        try:
            dataLegalityChecker(workList)
            __temp_workList = workList.copy()
            return self.__accept(__temp_workList)
        except BaseException as info:
            raise info