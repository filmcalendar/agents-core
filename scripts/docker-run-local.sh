#!/usr/bin/env bash

docker run -i \
  --name "fc-agents-${FC_COUNTRY}" \
  --env FC_COUNTRY="${FC_COUNTRY}" \
  --env GIT_HOST="${GIT_HOST}" \
  --env GIT_PASSWORD="${GIT_PASSWORD}" \
  --env GIT_REPO_DATA="${GIT_REPO_DATA}-${FC_COUNTRY}" \
  --env GIT_REPO_SRC="${GIT_REPO_SRC}-${FC_COUNTRY}" \
  --env GIT_USER_EMAIL="${GIT_USER_EMAIL}" \
  --env GIT_USER_NAME="${GIT_USER_NAME}" \
  --env GIT_USER="${GIT_USER}" \
  --rm \
    "local/filmcalendar/fc-agents-${FC_COUNTRY}:latest"
