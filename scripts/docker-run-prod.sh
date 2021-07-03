#!/usr/bin/env bash

# Runs a country level docker image (locally)

set -o errexit

echo "$FC_GIT_PASSWORD" | docker login ghcr.io --username "$FC_GIT_USER" --password-stdin

docker pull "ghcr.io/filmcalendar/fc-agents-${FC_COUNTRY}:latest"

docker run -i \
  --name "fc-agents-${FC_COUNTRY}" \
  --env FC_COUNTRY="${FC_COUNTRY}" \
  --env FC_GIT_HOST="${FC_GIT_HOST}" \
  --env FC_GIT_PASSWORD="${FC_GIT_PASSWORD}" \
  --env FC_GIT_REPO_DATA="${FC_GIT_REPO_DATA}-${FC_COUNTRY}" \
  --env FC_GIT_REPO_SRC="${FC_GIT_REPO_SRC}-${FC_COUNTRY}" \
  --env FC_GIT_USER_EMAIL="${FC_GIT_USER_EMAIL}" \
  --env FC_GIT_USER_NAME="${FC_GIT_USER_NAME}" \
  --env FC_GIT_USER="${FC_GIT_USER}" \
  --rm \
    "ghcr.io/filmcalendar/fc-agents-${FC_COUNTRY}:latest"
