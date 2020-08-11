#!/bin/bash

echo $(pwd)

docker --version

echo $TRAVIS_COMMIT
application="dev_portal"

docker build -t "$application:$TRAVIS_COMMIT"
