#!/usr/bin/env bash

npm i -g pm2 gulp-cli typescript@3.7.4
npm i gulp gulp-rename gulp-install del
pwd
cd audience-display
export truenpm=`which npm`
$truenpm install
cd ../ems-api
$truenpm install
cd ../ems-core
$truenpm install
cd ../ems-home
$truenpm install
cd ../ems-socket
$truenpm install
cd ../ems-web
$truenpm install
cd ../ref-tablet
$truenpm install
cd ../ems-frc-fms
$truenpm install
cd ..
