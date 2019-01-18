#!/bin/sh

set +e
cd 'builds'

download () {
  curl -L -# -o $2 $1
}

echo 'Mac OSX'
if [ -e osx-x64.zip ]
then
  echo "osx-x64.zip already exists..."
else
  download 'https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-4.0-macos64-static.zip' osx-x64.zip
fi
unzip -o -d ./osx/ -j osx-x64.zip '**/ffprobe' '**/ffmpeg'