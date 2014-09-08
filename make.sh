#!/bin/sh
sass src/scss/layout.scss:css/layout.css --style compressed
#find src/scripts/* -name "*.js" | xargs cat | uglifyjs -c -m -o js/app.min.js
