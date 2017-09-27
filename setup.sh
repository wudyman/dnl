#!/bin/bash

killall -9 uwsgi
killall -9 nginx
sudo rm -rf /etc/nginx_conf
sudo mkdir /etc/nginx_conf
sudo ln -s /home/wudy/study/web/dnl/dnl_nginx.conf /etc/nginx_conf/

sudo rm -rf /etc/uwsgi
sudo mkdir /etc/uwsgi
sudo mkdir /etc/uwsgi/vassals
sudo ln -s /home/wudy/study/web/dnl/dnl_uwsgi.ini /etc/uwsgi/vassals/

nginx
uwsgi --emperor /etc/uwsgi/vassals --uid www-data --gid www-data &

