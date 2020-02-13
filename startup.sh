#!/bin/sh

cd /home/node/app

# copy secrets
mkdir src/controllers/config
cp $KEY_PRIV src/controllers/config/jwtRS256.key
cp $KEY_PUB src/controllers/config/jwtRS256.key.json

# install dep & go
npm install
npm run build
