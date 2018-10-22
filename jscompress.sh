#!/bin/bash

java -version || exit 1;
time=$(date "+%Y%m%d%H%M%S")
echo "${time}"

if [ ! -d "./static/common/prod/" ];then
    mkdir ./static/common/prod
else
    rm -rf ./static/common/prod/*
fi

java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/main.js -o ./static/common/prod/main.min.${time}.js
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/main_mobile.js -o ./static/common/prod/main_mobile.min.${time}.js
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/main.css -o ./static/common/prod/main.min.${time}.css
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/main_mobile.css -o ./static/common/prod/main_mobile.min.${time}.css
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/z_main.css -o ./static/common/prod/z_main.min.${time}.css
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/z_main_mobile.css -o ./static/common/prod/z_main_mobile.min.${time}.css

java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/business.js -o ./static/common/prod/business.min.js
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/business_mobile.js -o ./static/common/prod/business_mobile.min.js
java -jar ./yuicompressor-2.4.8.jar ./static/common/dev_staging/citys.js -o ./static/common/prod/citys.min.js

sed -i "s/main.*css/main.min.${time}.css/" ./question/templates/question/head.html
sed -i "s/main.*js/main.min.${time}.js/" ./question/templates/question/head.html

sed -i "s/main_mobile.*js/main_mobile.min.${time}.js/" ./question/templates/question/head_mobile.html
sed -i "s/main_mobile.*css/main_mobile.min.${time}.css/" ./question/templates/question/head_mobile.html
sed -i "s/z_main_mobile.*css/z_main_mobile.min.${time}.css/" ./question/templates/question/head_mobile.html