#!/bin/bash

set -e

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



# sync the main site
bucket_name=$(output www-bucket)
aws s3 cp --recursive $HERE/dist/ s3://$bucket_name/

# Sync the admin site
aws s3 cp --recursive $HERE/members-admin/dist/ s3://$bucket_name/admin/
