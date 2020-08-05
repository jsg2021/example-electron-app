#!/usr/bin/env bash
set -e

VERSION=`node -pe "require('./package.json').version"`
rm -rf dist build
npm run build-ui

echo "Packaging app.asar..."
npx --quiet asar pack --exclude-hidden --unpack-dir "**/{node_modules/@electron,node_modules/electron/dist,packages/electron-view/src,packages/electron-view/public,packages/electron-view/node_modules}" . ./dist/app.asar

npx --quiet electron-packager ./dist "Your App Name" --prebuiltAsar ./dist/app.asar --app-version $VERSION --out ./build/ --platform linux #--platform darwin,linux
echo "Complete!"
rm -rf dist
