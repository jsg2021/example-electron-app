#!/usr/bin/env bash
set -e
#sometimes git returns strange things...this seems to clear the bad state.
git status &> /dev/null

DROP_MODULES=true
if [ -d node_modules ] ; then
	DROP_MODULES=false
fi

function finish {
	git add -A &>/dev/null #stage everything (including new files) so we can auto-delete them with the reset.
	git reset --hard --quiet
	if $DROP_MODULES; then
		rm -rf node_modules
	fi
}


#check for unstaged tracked files
if ! git diff-files --quiet; then
	echo 'There are uncommitted changes. Aborting.'
	exit 1
fi

#check for staged/not committed files
if ! git diff-index --quiet --cached HEAD; then
	echo 'There are uncommitted changes. Aborting.'
	exit 1
fi

trap finish EXIT

VERSION=`node -pe "require('./package.json').version"`
rm -rf dist build

rm -rf node_modules
npm i --production --no-progress

pushd src/ui/electron/view/ &> /dev/null
rm -rf node_modules build
CI=true npm it --no-progress
NODE_ENV=production npm run build
rm -rf node_modules
popd &> /dev/null

npx asar pack --exclude-hidden --unpack-dir "**/{view/src,view/public}" . ./dist/app.asar
rm -rf ./dist/app.asar.unpacked
rm -rf ./src/ui/electron/view/build

npm i --no-progress
# electron-packager ./dist "Your App Name" --app-version $VERSION --out ./build/ --platform darwin,linux
electron-packager ./dist "Your App Name" --app-version $VERSION --out ./build/ --platform darwin
# minor bug... the app.asar is in the wrong location...
# TODO: fix https://github.com/electron-userland/electron-packager/issues/161
