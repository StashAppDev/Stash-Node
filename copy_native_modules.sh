./node_modules/node-pre-gyp/bin/node-pre-gyp install -C ./node_modules/sqlite3/ --target_platform=darwin
./node_modules/node-pre-gyp/bin/node-pre-gyp install -C ./node_modules/sqlite3/ --target_platform=win32
./node_modules/node-pre-gyp/bin/node-pre-gyp install -C ./node_modules/sqlite3/ --target_platform=linux

mkdir ./builds/osx
mkdir ./builds/linux
mkdir ./builds/win

cp ./node_modules/sqlite3/lib/binding/node-v59-darwin-x64/node_sqlite3.node ./builds/osx/node_sqlite3.node
cp ./node_modules/sqlite3/lib/binding/node-v59-linux-x64/node_sqlite3.node ./builds/linux/node_sqlite3.node
cp ./node_modules/sqlite3/lib/binding/node-v59-win32-x64/node_sqlite3.node ./builds/win/node_sqlite3.node

mv ./builds/stashapp-macos ./builds/osx/stash
mv ./builds/stashapp-linux ./builds/linux/stash
mv ./builds/stashapp-win.exe ./builds/win/stash.exe