"""
@author: Terence.Sun
@email: terence@segofun.com
"""
__author__ = "Terence.Sun"
import time

class Timer_Record:
    """
    record the time
    """
    def __init__(self):
        self._time_start = None
        self._time_end = None

    def start(self):
        """
        begin to record time
        :return: None
        """
        if not self._time_end:
            # unit: ms
            self._time_start = int(round(time.time() * 1000))

    def end(self):
        """
        stop to record time
        :return: Msec
        """
        if self._time_start:
            self._time_end = int(round(time.time() * 1000))
            _temp = self._time_end - self._time_start
            self._time_start = None
            self._time_end = None
            return _temp

    def reset(self):
        """
        reset the timer record
        :return: None
        """
        self._time_start = None
        self._time_end = None