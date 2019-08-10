"""
@author: Terence.Sun
@email: terence@segofun.com
"""
__author__ = "Terence.Sun"

from nayo.main.methods import METHODS

class dataLegalityChecker:

    def __init__(self, workList):
        self.__data_inspect(workList)

    def __inspect_0(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["doc"], dict) or not isinstance(workPack["collection"], str) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")

    def __inspect_1(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["target_doc"], dict) or not isinstance(workPack["collection"], str) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")
        if workPack["target_doc"].get("_id") != None:
            if not isinstance(workPack["target_doc"].get("_id"), ObjectId):
                try:
                    workPack["target_doc"]["_id"] = ObjectId(workPack["target_doc"]["_id"])
                except BaseException as info:
                    raise TypeError("the query of ObjectId is wrong.")

    def __inspect_2(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["target_doc"], dict) or not isinstance(workPack["collection"], str) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")
        if workPack["target_doc"].get("_id") != None:
            if not isinstance(workPack["target_doc"].get("_id"), ObjectId):
                try:
                    workPack["target_doc"]["_id"] = ObjectId(workPack["target_doc"]["_id"])
                except BaseException as info:
                    raise TypeError("the query of ObjectId is wrong.")
        try:
            if not isinstance(workPack["param"], dict):
                workPack["param"] = {}
        except:
            workPack["param"] = workPack.get("param", {})

    def __inspect_3(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["target_doc"], dict) or not isinstance(workPack["collection"], str) or not isinstance(workPack["doc"], dict) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")
        if workPack["target_doc"].get("_id") != None:
            if not isinstance(workPack["target_doc"].get("_id"), ObjectId):
                try:
                    workPack["target_doc"]["_id"] = ObjectId(workPack["target_doc"]["_id"])
                except BaseException as info:
                    raise TypeError("the query of ObjectId is wrong.")
        try:
            if not isinstance(workPack["param"], dict):
                workPack["param"] = {}
        except:
            workPack["param"] = workPack.get("param", {})

    def __inspect_4(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["pipeline"], list) or not isinstance(workPack["collection"], str) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")
        try:
            if not isinstance(workPack["param"], dict):
                workPack["param"] = {}
        except:
            workPack["param"] = workPack.get("param", {})

    def __inspect_5(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["target_doc"], dict) or not isinstance(workPack["collection"], str) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")
        if workPack["target_doc"].get("_id") != None:
            if not isinstance(workPack["target_doc"].get("_id"), ObjectId):
                try:
                    workPack["target_doc"]["_id"] = ObjectId(workPack["target_doc"]["_id"])
                except BaseException as info:
                    raise TypeError("the query of ObjectId is wrong.")

    def __inspect_6(self, workPack):
        """
        inspect the workPack legality
        :param workPack
        :return None
        """
        if not isinstance(workPack["target_doc"], dict) or not isinstance(workPack["collection"], str) or not isinstance(workPack["db"], str):
            raise TypeError("invalid parameter")
        if workPack["target_doc"].get("_id") != None:
            if not isinstance(workPack["target_doc"].get("_id"), ObjectId):
                try:
                    workPack["target_doc"]["_id"] = ObjectId(workPack["target_doc"]["_id"])
                except BaseException as info:
                    raise TypeError("the query of ObjectId is wrong.")
        try:
            if not isinstance(workPack["param"], dict):
                workPack["param"] = {}
        except:
            workPack["param"] = workPack.get("param", {})

    def __data_inspect(self, workList):
        """
        inspect the data's Legality
        :param workList: the list contain the workPack
        :return: None
        """
        if not isinstance(workList, list):
            raise TypeError("the workList type should be List!")
        if len(workList) < 1:
            raise ValueError("invalid parameter, the workList should not be empty.")
        _workPack_inspect_dict = {
            METHODS["insertOne"]: self.__inspect_0,
            METHODS["deleteOne"]: self.__inspect_1,
            METHODS["findOne"]: self.__inspect_2,
            METHODS["findOneAndUpdate"]: self.__inspect_3,
            METHODS["aggregate"]: self.__inspect_4,
            METHODS["deleteMany"]: self.__inspect_5,
            METHODS["updateMany"]: self.__inspect_6
        }
        for workPack in workList:
            _workPack_inspect_dict[workPack["method"]](workPack)
        # check the transaction data legality
        if len(workList) != 1:
            _err_list = []
            _allow_method = [METHODS["insertOne"], METHODS["deleteOne"], METHODS["findOneAndUpdate"], METHODS["deleteMany"], METHODS["updateMany"]]
            for index in range(len(workList)):
                if (workList[index]["method"] not in _allow_method):
                    _err_list.append(index)
            if len(_err_list) != 0:
                raise ValueError({
                    "name": "transaction method type error",
                    "msg": "the method of the work_pack data are not allowed",
                    "index": _err_list
                })