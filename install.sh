#!/usr/bin/env bash

npm i -g pm2 gulp-cli
pwd
cd audience-display && npm install && cd ..
cd ems-api && npm install && cd ..
cd ems-core && npm install && cd ..
cd ems-home && npm install && cd ..
cd ems-socket && npm install && cd ..
cd ems-web && npm install && cd ..
cd ref-tablet && npm install && cd ..
npm install
