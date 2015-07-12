#!/bin/sh
node index.js $(ls components-src/*.html | sed -n 's/\(.*\/\)*\(.*\)\..*$/\2/p' | tr '\n' ' ')
echo "Done."
read -t1
