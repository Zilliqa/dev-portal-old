#!/bin/bash

echo $(pwd)

docker --version

echo $TRAVIS_COMMIT
application="dev-portal"

docker build -t "$application:$TRAVIS_COMMIT" .
