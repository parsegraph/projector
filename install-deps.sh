#!/bin/bash
yarn add --immutable --immutable-cache --check-cache
yarn add --no-lockfile `node -e "Object.keys(JSON.parse(require('fs').readFileSync('package.json')).peerDependencies || {}).forEach(dep=>console.log(dep))"`
