#!/usr/bin/env bash
# Bootstrap script for a set of country agents

echo "Once upon a time..."

# Read .env vars
set -o allexport
source .env
set +o allexport


# FC_COUNTRY is read from a .env on a country-agents app
data_dir="data-${FC_COUNTRY}"
mkdir -p "${data_dir}"

# list agents found on country app
agents=$(fc-agent list "$@")
IFS=',' read -r -a agents_list <<< "$agents"
for agent in "${agents_list[@]}"; do
  echo "fc-agent scrape -a ${agent}"
  # spawn a new agent every 10secs
  fc-agent scrape -a "${agent}" > "${data_dir}/${agent}.json" &
  sleep 10
done

wait

{
  today=$(date -u +"%Y-%m-%d")
  data_dir="data-${FC_COUNTRY}"
  data_repo="filmcalendar/data-${FC_COUNTRY}"

  cd "${data_dir}" || exit;
  git init
  # git credentials are env secrets on docker run
  git config user.email "${GITHUB_USER_EMAIL}"
  git config user.name "${GITHUB_USER_NAME}"
  git checkout -b main
  git add .
  git commit -m "Daily dispatch: ${today}"
  git push --set-upstream "https://${GITHUB_TOKEN}@github.com/${data_repo}.git" main
}

echo "The End."
