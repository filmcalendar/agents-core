#!/usr/bin/env bash

rimraf dist
tsc --build tsconfig.build.json
esbuild src/index.ts \
  --bundle \
  --platform=node \
  --outfile=dist/index.cjs

esbuild src/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --outfile=dist/index.mjs


cp src/agents-core.d.ts dist
cp dist/agent/index.d.ts dist/agent.d.ts
