#!/bin/bash

set -e

rm -rf ./builds

cd packages

packages=(
  stash-frontend
  # stash-server
)

for pkg in "${packages[@]}"
do
  cd $pkg
  echo "Building ${pkg}"
  yarn build
  cd ..
done

echo "Copying compiled frontend into server"
rm -rf ./stash-server/dist-ui
cp -r ./stash-frontend/dist/stash-frontend ./stash-server/dist-ui

echo "Building package"
cd stash-server
yarn package

echo "Copying builds..."
cd ../..
cp -r ./packages/stash-server/builds ./builds

# Make some directories
mkdir -p ./builds/osx
mkdir -p ./builds/linux
mkdir -p ./builds/win

# Move the executables
mv ./builds/stash-server-macos ./builds/osx/stash
mv ./builds/stash-server-linux ./builds/linux/stash
mv ./builds/stash-server-win.exe ./builds/win/stash.exe

echo "Copying native modules"
# Make sure it's installed for each platform
./node_modules/node-pre-gyp/bin/node-pre-gyp install -C ./node_modules/sqlite3/ --target_platform=darwin
./node_modules/node-pre-gyp/bin/node-pre-gyp install -C ./node_modules/sqlite3/ --target_platform=win32
./node_modules/node-pre-gyp/bin/node-pre-gyp install -C ./node_modules/sqlite3/ --target_platform=linux

# Copy to the correct build dir
cp ./node_modules/sqlite3/lib/binding/node-v64-darwin-x64/node_sqlite3.node ./builds/osx/node_sqlite3.node
cp ./node_modules/sqlite3/lib/binding/node-v64-linux-x64/node_sqlite3.node ./builds/linux/node_sqlite3.node
cp ./node_modules/sqlite3/lib/binding/node-v64-win32-x64/node_sqlite3.node ./builds/win/node_sqlite3.node

echo "Downloading FFMPEG"
bash ./scripts/download_ffmpeg.sh