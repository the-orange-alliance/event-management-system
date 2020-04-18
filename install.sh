#!/usr/bin/env bash

npm i -g pm2 gulp-cli
npm i gulp gulp-rename gulp-install del
pwd
cd audience-display
npm install
cd ../ems-api
npm install
cd ../ems-core
npm install
cd ../ems-home
npm install
cd ../ems-socket
npm install
cd ../ems-web
npm install
cd ../ref-tablet
npm install
cd ..
npm run build
