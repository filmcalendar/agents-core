#!/usr/bin/env bash

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
    "local/filmcalendar/fc-agents-${FC_COUNTRY}:latest"