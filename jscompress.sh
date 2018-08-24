#!/bin/bash

java -version || exit 1;
time=$(date "+%Y%m%d%H%M%S")
echo "${time}"

if [ ! -d "./static/common/prod/" ];then
    mkdir ./static/common/prod
else
    rm -rf ./static/common/prod/*
fi

java -jar ./yuicompressor-2.4.8.jar ./static/common/main.js -o ./static/common/prod/main.min.${time}.js
java -jar ./yuicompressor-2.4.8.jar ./static/common/mobile_main.js -o ./static/common/prod/mobile_main.min.${time}.js
java -jar ./yuicompressor-2.4.8.jar ./static/common/main.css -o ./static/common/prod/main.min.${time}.css
java -jar ./yuicompressor-2.4.8.jar ./static/common/mobile_main.css -o ./static/common/prod/mobile_main.min.${time}.css
java -jar ./yuicompressor-2.4.8.jar ./static/common/z_main.css -o ./static/common/prod/z_main.min.${time}.css
java -jar ./yuicompressor-2.4.8.jar ./static/common/mobile_z_main.css -o ./static/common/prod/mobile_z_main.min.${time}.css

sed -i "s/main.*css/main.min.${time}.css/" ./question/templates/question/head.html
sed -i "s/main.*js/main.min.${time}.js/" ./question/templates/question/head.html

sed -i "s/mobile_z_main.*css/mobile_z_main.min.${time}.css/" ./question/templates/question/head_mobile.html
sed -i "s/mobile_main.*css/mobile_main.min.${time}.css/" ./question/templates/question/head_mobile.html
sed -i "s/mobile_main.*js/mobile_main.min.${time}.js/" ./question/templates/question/head_mobile.html

