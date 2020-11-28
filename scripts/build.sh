#!/usr/bin/env bash

rimraf dist
microbundle --output dist/index.js  --no-pkg-main --target node --sourcemap false --format esm
