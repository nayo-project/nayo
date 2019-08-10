"""
database config default
"""

database = {
    # connection config
    "connection": {},
    # transaction config
    "transaction": {},
    # nayo config
    # logging
}

# default logging function
def default_record_logging(process_time, query_statement):
    for sentence in query_statement:
        print(sentence)
    print(f"Execution Time: {process_time}ms")

# set default value
database["connection"].setdefault("readPreference", "secondaryPreferred")
database["connection"].setdefault("readConcernLevel", "majority")
database["transaction"].setdefault("read_concern", { "level": "majority" })
database["transaction"].setdefault("write_concern", { "w": 1 })
database.setdefault("logging", default_record_logging)