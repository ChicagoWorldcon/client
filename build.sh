#!/bin/bash
set -e

npm install

HERE=$(unset CDPATH; cd $(dirname $0); pwd)
output() {
    (
        cd $HERE/../infrastructure
        terraform output $1
    )
}

eval $(aws --profile=chicago keyring show --export)
export AWS_REGION=us-west-2
export AWS_PROFILE=chicago

export PATH=$PATH:$HERE/node_modules/.bin

export API_HOST=$(output api-address):$(output api-port)
export TITLE="Chicago 2022 Bid"
export NODE_ENV=${NODE_ENV:-development}

echo "Building a client for $(cd $HERE/../infrastructure; terraform workspace show)"

rm -rf $HERE/dist
cd $HERE && webpack -p  --progress --colors

