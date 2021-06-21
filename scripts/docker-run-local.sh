#!/usr/bin/env bash

# Runs a country level docker image (locally)

set -o errexit

# read .env vars
set -o allexport
source .env
set +o allexport

container_name=fc-agents-${FC_COUNTRY}-local
docker_image=${FC_DOCKER_REGISTRY}/${FC_DOCKER_IMAGE_OWNER}/fc-agents-${FC_COUNTRY}:latest

echo "${FC_DOCKER_REGISTRY_PASSWORD}" | docker login "${FC_DOCKER_REGISTRY}" \
  --username "${FC_DOCKER_REGISTRY_USER}" \
  --password-stdin

docker pull "$docker_image"

docker run -i \
  --name "$container_name" \
  --env FC_COUNTRY="${FC_COUNTRY}" \
  --env FC_GIT_PASSWORD="${FC_GIT_PASSWORD}" \
  --env FC_GIT_REPO_DATA="${FC_GIT_REPO_DATA}-${FC_COUNTRY}" \
  --env FC_GIT_REPO_SRC="${FC_GIT_REPO_SRC}-${FC_COUNTRY}" \
  --env FC_GIT_USER_EMAIL="${FC_GIT_USER_EMAIL}" \
  --env FC_GIT_USER_NAME="${FC_GIT_USER_NAME}" \
  --env FC_GIT_USER="${FC_GIT_USER}" \
  "$docker_image"
