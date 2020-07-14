#!/bin/bash


docker run -d -p 8080:80 --name dev-portal dev-portal:1.0
echo "container is viewable on localhost:8080"
