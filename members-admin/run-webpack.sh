#!/bin/bash

./node_modules/.bin/webpack \
    --env.NODE_ENV=$NODE_ENV \
    --env.API_HOST=$API_HOST \
    --env.TITLE="$TITLE" \
    "$@"
