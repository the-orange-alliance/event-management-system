#!/usr/bin/env bash
cd build/ems
npm install sqlite3 --build-from-source --runtime=electron --target=2.0.4 --dist-url=https://atom.io/download/electron
npm i --production
cd ../..
npm run dist
ls
