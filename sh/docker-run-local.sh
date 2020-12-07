#!/usr/bin/env bash

# Runs a country level docker image (locally)

set -o errexit

# read .env vars
set -o allexport
source .env
set +o allexport

container_name=fc-agents-${FC_COUNTRY}-local
docker_image=${FC_DOCKER_REGISTRY}/${FC_DOCKER_IMAGE_OWNER}/fc-agents-${FC_COUNTRY}:latest
data_repo=https://${FC_GIT_HOST_PASSWORD}@${FC_GIT_HOST}/${FC_GIT_HOST_DATA_REPO}-${FC_COUNTRY}.git

echo "${FC_DOCKER_REGISTRY_PASSWORD}" | docker login "${FC_DOCKER_REGISTRY}" \
  --username "${FC_DOCKER_REGISTRY_USER}" \
  --password-stdin

docker pull "${docker_image}"

docker run -i \
  --name "${container_name}" \
  --env FC_COUNTRY="${FC_COUNTRY}" \
  --env FC_GIT_HOST_DATA_REPO="${data_repo}" \
  --env FC_GIT_HOST_PASSWORD="${FC_GIT_HOST_PASSWORD}" \
  --env FC_GIT_HOST_USER="${FC_GIT_HOST_USER}" \
  --env FC_GIT_USER_EMAIL="${FC_GIT_USER_EMAIL}" \
  --env FC_GIT_USER_NAME="${FC_GIT_USER_NAME}" \
  "${docker_image}"
