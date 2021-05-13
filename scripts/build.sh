#!/usr/bin/env bash

rimraf dist
tsc --build tsconfig.build.json
esbuild src/index.ts --bundle --format=esm --outfile=dist/index.js \
  --external:util --external:fs --external:path \
  --external:@filmcalendar/schemas --external:@filmcalendar/types --external:@sindresorhus/slugify --external:@tuplo/series-with \
  --external:ajv --external:ajv-formats --external:clean-deep --external:date-fns \
  --external:md5 --external:normalizr --external:yargs-parser \
