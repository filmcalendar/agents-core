#!/usr/bin/env bash

rimraf dist
microbundle --target node --sourcemap false --format cjs --tsconfig tsconfig.build.json
cp src/@types/film-calendar.d.ts dist/film-calendar.d.ts
cp -r src/@schemas dist/schemas
