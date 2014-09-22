#!/bin/bash

if [ -z "$1" ] ; then
    echo "Enter a database name"
      exit 1
    fi

    mongoimport --jsonArray --drop --db $1 --collection users --file ../../db/users.json
    mongoimport --jsonArray --drop --db $1 --collection clients --file ../../db/clients.json
    mongoimport --jsonArray --drop --db $1 --collection therapists --file ../../db/therapists.json
    mongoimport --jsonArray --drop --db $1 --collection treatments --file ../../db/treatments.json
