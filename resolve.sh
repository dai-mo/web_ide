#!/bin/bash

mkdir -p ./ext

wget -N -P ./ext --user=${ARTIFACTORY_USERNAME} --password=${ARTIFACTORY_PASSWORD} ${ARTIFACTORY_URL}/artifactory/libs-snapshot-local/tech/brewlabs/tech.brewlabs.blang/0.1.0-SNAPSHOT/blang-properties-0.1.0-SNAPSHOT.tgz

