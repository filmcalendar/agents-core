#!/usr/bin/env bash

# reset distribution folder
rimraf dist

# build library
microbundle --output dist/index.js  --no-pkg-main --target node --sourcemap false --format cjs

# docker distribution files
cp -r docker dist
