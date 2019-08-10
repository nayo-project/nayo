#!/usr/bin/env python
#-*- coding:utf-8 -*-

#############################################
# File Name: setup.py
# Author: Terence.Sun
# Mail: terence@segofun.com
# Created Time: 2019-8-10
#############################################

from setuptools import setup, find_packages

setup(
    name="nayo",
    version="2.0.0",
    keywords=("nayo", "mongo", "operation", "DAO"),
    description="the simple operation interface for mongoDB",
    long_description=open("README.rst").read(),
    license="MIT Licence",
    url="https://github.com/nayo-project/nayo",
    project_urls={
        "nayo source": "https://github.com/nayo-project/nayo"
    },
    python_requires=">=3.6",
    author="Terence.Sun",
    author_email="terence@segofun.com",
    packages=find_packages(),
    install_requires=["pymongo >= 3.8.0 "]
)