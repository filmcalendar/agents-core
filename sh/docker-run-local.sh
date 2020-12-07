#!/usr/bin/env bash

# Runs a country level docker image (locally)

set -o errexit

# read .env vars
set -o allexport
source .env
set +o allexport

container_name=fc-agents-${FC_COUNTRY}-local
docker_image=ghcr.io/filmcalendar/fc-agents-${FC_COUNTRY}:latest
data_repo=filmcalendar/data-${FC_COUNTRY}

echo "${FC_GITHUB_TOKEN}" | docker login ghcr.io --username "${FC_GITHUB_USER}" --password-stdin

docker pull "${docker_image}"

docker run -i \
  --name "${container_name}" \
  --env FC_COUNTRY="${FC_COUNTRY}" \
  --env FC_GITHUB_TOKEN="${FC_GITHUB_TOKEN}" \
  --env FC_GITHUB_USER_EMAIL="${FC_GITHUB_USER_EMAIL}" \
  --env FC_GITHUB_USER_NAME="${FC_GITHUB_USER_NAME}" \
  --env FC_GITHUB_USER="${FC_GITHUB_USER}" \
  --env FC_GITHUB_DATA_REPO="${data_repo}" \
  "${docker_image}"
