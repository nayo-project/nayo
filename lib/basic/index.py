# coding: utf-8
"""
nayo-python DAO
Created on 2019/5/2
@author: Terence.Sun
@email: terence@segofun.com
"""
__author__ = "Terence.Sun"

from pymongo import MongoClient
from pymongo import read_concern
from pymongo import read_preferences
from pymongo import write_concern
from nayo.tool import Timer_Record


class DAO:

    def __init__(self, url, config={}):
        self.url = url
        self.config = config
        self.execute_sentences = []
        # detail to see http://api.mongodb.com/python/current/api/pymongo/mongo_client.html
        self.client = MongoClient(self.url, **self.config["connection"])
        self.mode = "normal"  # normal or transaction
        self.__available_database = self.client.list_database_names()

    def __check_database(self, db):
        if db not in self.__available_database:
            raise ValueError(f"the db [{db}] is not available")

    def __commit_session(self, session):
        session.commit_transaction()

    def __transform_config_of_transaction(self):
        _temp_dict = {}
        for key in self.config["transaction"].keys():
            if key == "read_concern":
                # http://api.mongodb.com/python/current/api/pymongo/read_concern.html
                if self.config["transaction"].get(key) is not None:
                    _temp_dict["read_concern"] = read_concern.ReadConcern(**self.config["transaction"][key])
            if key == "write_concern":
                # http://api.mongodb.com/python/current/api/pymongo/write_concern.html
                if self.config["transaction"].get(key) is not None:
                    _temp_dict["write_concern"] = write_concern.WriteConcern(**self.config["transaction"][key])
            if key == "read_preference":
                # http://api.mongodb.com/python/current/api/pymongo/read_preferences.html#module-pymongo.read_preferences
                if self.config["transaction"].get(key) is not None:
                    _temp_dict["read_preference"] = self.config["transaction"][key]
        return _temp_dict

    def __do_in_session(self, ls_data, session):
        with session.start_transaction(**self.__transform_config_of_transaction()):
            for sentence in ls_data:
                exec(sentence)
            self.__commit_session(session)

    def transaction(self, ls_data=None):
        """
        transaction
        @param ls_data-->List
        @return result
        """
        if not isinstance(ls_data, list):
            raise TypeError("the param should be List")
        timer = Timer_Record()
        timer.start()
        with self.client.start_session() as session:
            try:
                self.__do_in_session(ls_data, session)
                self.config["logging"](timer.end(), self.execute_sentences)
            except Exception as info:
                session.abort_transaction()
                timer.reset()
                return info

    def insert_one(self, dt_data, collection, db):
        """
        insert_one
        @params dt_data-->Dictionary
        @params collection-->String
        @return insert result, if mode is transaction, here will return the sentence of query
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(db, str):
            raise TypeError("the third param should be String")
        self.__check_database(db)
        self.execute_sentences.append(f"client.db('{db}').collection('{collection}').insert_one({dt_data})")
        if self.mode == "transaction":
            _ret = f"self.client['{db}']['{collection}'].insert_one({dt_data}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].insert_one(dt_data)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def insert_many(self, ls_data, collection, db):
        """
        insert_many
        @params ls_data-->List
        @params collection-->String
        @return insert result, if mode is transaction, here will return the sentence of query
        """
        if not isinstance(ls_data, list):
            raise TypeError("the first param should be List")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(db, str):
            raise TypeError("the third param should be String")
        self.__check_database(db)
        self.execute_sentences.append(f"client.db('{db}').collection('{collection}').insert_many({ls_data})")
        if self.mode == "transaction":
            _ret = f"self.client['{db}']['{collection}'].insert_many({ls_data}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].insert_many(ls_data)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def delete_one(self, dt_data, collection, db):
        """
        delete_one
        @params dt_data-->Dictionary
        @params collection-->String
        @return result
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(db, str):
            raise TypeError("the third param should be String")
        self.__check_database(db)
        self.execute_sentences.append(f"client.db('{db}').collection('{collection}').delete_one({dt_data})")
        if self.mode == "transaction":
            _ret = f"self.client['{db}']['{collection}'].delete_one({dt_data}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].delete_one(dt_data)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def delete_many(self, dt_data, collection, db):
        """
        delete_many
        @params dt_data-->Dictionary
        @params collection-->String
        @return result
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(db, str):
            raise TypeError("the third param should be String")
        self.__check_database(db)
        self.execute_sentences.append(f"client.db('{db}').collection('{collection}').delete_many({dt_data})")
        if self.mode == "transaction":
            _ret = f"self.client['{db}']['{collection}'].delete_many({dt_data}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].delete_many(dt_data)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def find(self, dt_data, collection, options, db):
        """
        find
        @params dt_data-->Dictionary
        @params collection-->String
        @params options-->Dictionary
        @return result
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').find({dt_data})")
        else:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').find({dt_data}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].find({dt_data}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].find({dt_data}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _cursor = self.client[db][collection].find(dt_data, **options)
            _ret = [doc for doc in _cursor]
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def find_one(self, dt_data, collection, options, db):
        """
        find_one
        @params dt_data-->Dictionary
        @params collection-->String
        @params options-->Dictionary
        @return result
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').find_one({dt_data})")
        else:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one({dt_data}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].find_one({dt_data}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].find_one({dt_data}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].find_one(dt_data, **options)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def find_one_and_update(self, dt_data, doc, collection, options, db):
        """
        find_one_and_update
        @params dt_data-->Dictionary
        @params doc-->Dictionary
        @params collection-->String
        @params options-->Dictionary
        @return document --> Pre modification document
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(doc, dict):
            raise TypeError("the second param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the third param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one_and_update({dt_data}, {doc})")
        else:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one_and_update({dt_data}, {doc}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].find_one_and_update({dt_data}, {doc}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].find_one_and_update({dt_data}, {doc}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].find_one_and_update(dt_data, doc, **options)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def find_one_and_delete(self, dt_data, collection, options, db):
        """
        find_one_and_delete
        @params dt_data-->Dictionary
        @params collection-->String
        @params options-->Dictionary
        @return document --> Pre modification document
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the third param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one_and_delete({dt_data})")
        else:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one_and_delete({dt_data}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].find_one_and_delete({dt_data}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].find_one_and_delete({dt_data}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].find_one_and_delete(dt_data, **options)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def find_one_and_replace(self, dt_data, doc, collection, options, db):
        """
        find_one_and_replace
        @params dt_data-->Dictionary
        @params doc-->Dictionary
        @params collection-->String
        @params options-->Dictionary
        @return document --> Pre modification document
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(doc, dict):
            raise TypeError("the second param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the third param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one_and_replace({dt_data}, {doc})")
        else:
            self.execute_sentences.append(
                f"client.db('{db}').collection('{collection}').find_one_and_replace({dt_data}, {doc}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].find_one_and_replace({dt_data}, {doc}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].find_one_and_replace({dt_data}, {doc}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].find_one_and_replace(dt_data, doc, **options)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    """
    update_one is replaced by find_one_and_update
    """

    def update_many(self, dt_data, doc, collection, options, db):
        """
        update_many
        @params dt_data-->Dictionary
        @params doc-->Dictionary
        @params collection-->String
        @params options-->Dictionary
        @return result
        """
        if not isinstance(dt_data, dict):
            raise TypeError("the first param should be Dictionary")
        if not isinstance(doc, dict):
            raise TypeError("the second param should be Dictionary")
        if not isinstance(collection, str):
            raise TypeError("the third param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').update_many({dt_data}, {doc})")
        else:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').update_many({dt_data}, {doc}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].update_many({dt_data}, {doc}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].update_many({dt_data}, {doc}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _ret = self.client[db][collection].update_many(dt_data, doc, **options)
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret

    def aggregate(self, pipeline, collection, options, db):
        """
        aggregate
        @params pipeline-->List
        @params collection-->String
        @params options-->Dictionary
        @return result
        """
        if not isinstance(pipeline, list):
            raise TypeError("the first param should be List")
        if not isinstance(collection, str):
            raise TypeError("the second param should be String")
        if not isinstance(options, dict):
            options = {}
        if not isinstance(db, str):
            raise TypeError("the db param should be String")
        self.__check_database(db)
        _temp_str = []
        for key in options.keys():
            _temp_str.append(f"{key}={options[key]}")
        _temp_str = ",".join(_temp_str)
        if len(_temp_str) == 0:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').aggregate({pipeline})")
        else:
            self.execute_sentences.append(f"client.db('{db}').collection('{collection}').aggregate({pipeline}, {options})")
        if self.mode == "transaction":
            if len(_temp_str) == 0:
                _ret = f"self.client['{db}']['{collection}'].aggregate({pipeline}, session=session)"
            else:
                _ret = f"self.client['{db}']['{collection}'].aggregate({pipeline}, {_temp_str}, session=session)"
        else:
            timer = Timer_Record()
            timer.start()
            _cursor = self.client[db][collection].aggregate(pipeline, **options)
            _ret = [doc for doc in _cursor]
            self.config["logging"](timer.end(), self.execute_sentences)
            self.execute_sentences = []
        return _ret