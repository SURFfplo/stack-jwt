#!/bin/bash

# Run this script once to build secrets & configs

echo "read priv key:"
docker secret create jwt_key_priv jwtRS256.key
echo done...

echo "read pub key:"
docker secret create jwt_key_pub jwtRS256.key.json
echo done...

