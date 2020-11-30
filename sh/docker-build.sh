#!/usr/bin/env bash

# Build country level docker image

set -o errexit

# read .env vars
set -o allexport
source .env
set +o allexport

# FC_COUNTRY is read from .env
image=fc-agents-${FC_COUNTRY}:latest

# copy over docker distribution files from @agents-core
rimraf docker
rm -f .dockerignore
mkdir -p docker
cp -r ./node_modules/@filmcalendar/agents-core/dist/docker .
ln -s docker/.dockerignore .dockerignore

docker build \
  --file docker/Dockerfile \
  --build-arg FC_COUNTRY="${FC_COUNTRY}" \
  --tag "${image}" \
  .

rm .dockerignore
rimraf docker
