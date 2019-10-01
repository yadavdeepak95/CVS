#!/bin/sh

VERSION=0.0.13
PORT_S=3001
PORT_M=3000

kill -9 $(lsof -i :$PORT_S | tail -n1 | awk '{print $2}')
kill -9 $(lsof -i :$PORT_M | tail -n1 | awk '{print $2}')
#kill -9 $(lsof -i)
cd ..
./teardownFabric.sh
cd dadas-cerver
composer card delete -c admin@dadas-cerver
cd ..
composer card delete -c PeerAdmin@hlfv1
./startFabric.sh
#cd dadas-cerver
#cd ..
./createPeerAdminCard.sh
cd dadas-cerver
composer network install --archiveFile dadas-cerver@$VERSION.bna --card PeerAdmin@hlfv1
composer network start --networkName dadas-cerver --networkVersion $VERSION --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw
composer card import --file admin@dadas-cerver.card &&  composer network ping --card admin@dadas-cerver

export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "fc39552f99ec9d24124e",
    "clientSecret": "4d2b66655db89ddc6b699ca755f51a8d9dc69477",
    "authPath": "/auth/github",
    "callbackURL": "/auth/github/callback",
    "successRedirect": "http://localhost:5200?loggedIn=true",
    "failureRedirect": "/"
  }
}'


gnome-terminal -e "composer-rest-server -c admin@dadas-cerver -p $PORT_S"

gnome-terminal -e "composer-playground -p 8090"

cd ./WEBAPPS/USERWEBAPP
gnome-terminal -e "npm start"

cd ..

cd ./ADMINWEBAPP
gnome-terminal -e "npm start"

cd ~/fabric-dev-servers/dadas-cerver
composer-rest-server -c admin@dadas-cerver -m true -p $PORT_M

