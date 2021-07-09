#!/usr/bin/env bash

rimraf dist
tsc --build tsconfig.build.json
esbuild src/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --outfile=dist/index.js

cp src/agents-core.d.ts dist
cp dist/agent/index.d.ts dist/agent.d.ts
