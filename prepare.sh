#!/bin/bash

# clean mounts
rm -rf /mnt/nfs/nfsdlo/$STACK_NETWORK/$STACK_SERVICE/$STACK_VERSION/jwt
rm -rf /mnt/nfs/nfsdlo/$STACK_NETWORK/$STACK_SERVICE/$STACK_VERSION/tmp

# create nfs mount
mkdir -p /mnt/nfs/nfsdlo/$STACK_NETWORK/$STACK_SERVICE/$STACK_VERSION/jwt
mkdir -p /mnt/nfs/nfsdlo/$STACK_NETWORK/$STACK_SERVICE/$STACK_VERSION/tmp

# write data
cp -a ./jwt/* /mnt/nfs/nfsdlo/$STACK_NETWORK/$STACK_SERVICE/$STACK_VERSION/jwt
cp -a ./startup.sh /mnt/nfs/nfsdlo/$STACK_NETWORK/$STACK_SERVICE/$STACK_VERSION/tmp

