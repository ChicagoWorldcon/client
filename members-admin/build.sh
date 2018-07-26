#!/bin/bash

docker build -t kansa-admin-build --build-arg node_env=development .
docker run --rm -v ${PWD}/dist:/usr/src/app/dist kansa-admin-build "$@"
