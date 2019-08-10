"""
@author: Terence.Sun
@email: terence@segofun.com
"""
__author__ = "Terence.Sun"

def init_config(defaultConfig, config):
    if not isinstance(config, dict):
        raise TypeError("【config error】database config type should be Dict!")
    for key_1 in config.keys():
        if isinstance(config[key_1], dict):
            for key_2 in config[key_1].keys():
                defaultConfig[key_1][key_2] = config[key_1][key_2]
        else:
            defaultConfig[key_1] = config[key_1]
    return defaultConfig