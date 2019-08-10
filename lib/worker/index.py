"""
Created on 2019/5/9
@author: Terence.Sun
@email: terence@segofun.com
"""

from nayo.basic.index import DAO
from nayo.main.methods import METHODS
import demjson

class Worker(DAO):
    def __init__(self, url, config={}):
        DAO.__init__(self, url, config=config)
        self.__rule = {
            METHODS["insertOne"]: "insertOne",
            METHODS["deleteOne"]: "deleteOne",
            METHODS["findOne"]: "findOne",
            METHODS["findOneAndUpdate"]: "findOneAndUpdate",
            METHODS["aggregate"]: "aggregate",
            METHODS["deleteMany"]: "deleteMany",
            METHODS["updateMany"]: "updateMany"
        }

    def __rule_0(self, workPack):
        return f"({str(demjson.encode(workPack['doc'], encoding='utf8'), encoding='utf8')})"
    def __rule_1(self, workPack):
        return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')})"
    def __rule_2(self, workPack):
        if len(workPack["param"].keys()) != 0:
            return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['param'], encoding='utf8'), encoding='utf8')})"
        else:
            return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')})"
    def __rule_3(self, workPack):
        if len(workPack["param"].keys()) != 0:
            return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['doc'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['param'], encoding='utf8'), encoding='utf8')})"
        else:
            return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')})"
    def __rule_4(self, workPack):
        if len(workPack["param"].keys()) != 0:
            return f"({str(demjson.encode(workPack['pipeline'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['param'], encoding='utf8'), encoding='utf8')})"
        else:
            return f"({str(demjson.encode(workPack['pipeline'], encoding='utf8'), encoding='utf8')})"
    def __rule_5(self, workPack):
        return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')})"
    def __rule_6(self, workPack):
        if len(workPack["param"].keys()) != 0:
            return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['doc'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['param'], encoding='utf8'), encoding='utf8')})"
        else:
            return f"({str(demjson.encode(workPack['target_doc'], encoding='utf8'), encoding='utf8')}, {str(demjson.encode(workPack['doc'], encoding='utf8'), encoding='utf8')})"


    def gen_query_statement(self, workList):
        """
        generate the query string
        :param workList
        :return: query_statement
        """
        try:
            self.query_statement = []
            swicth_dict = {
                METHODS["insertOne"]: self.__rule_0,
                METHODS["deleteOne"]: self.__rule_1,
                METHODS["findOne"]: self.__rule_2,
                METHODS["findOneAndUpdate"]: self.__rule_3,
                METHODS["aggregate"]: self.__rule_4,
                METHODS["deleteMany"]: self.__rule_5,
                METHODS["updateMany"]: self.__rule_6
            }
            for workPack in workList:
                _temp = f"db.{workPack['collection']}.{self.__rule[workPack['method']]}"
                _temp += swicth_dict[workPack["method"]](workPack)
                self.query_statement.append(_temp)
        except BaseException as info:
            raise TypeError("the workPack struction is wrong, please to check!")