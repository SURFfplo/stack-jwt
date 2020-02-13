#!/bin/sh

cd /home/node/app

# copy secrets
mkdir src/controllers/config
cp $KEY_PRIV_FILE src/controllers/config/jwtRS256.key
cp $KEY_PUB_FILE src/controllers/config/jwtRS256.key.json

# install dep & go
npm install
npm run build
