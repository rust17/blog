---
layout: post
category: [linux,web]
title:  "一个Linux nginx环境下php项目配置"
tags: [php,nginx,linux]
---
<br>

还是接着上回的文章--[Linux nginx 配置多站点](https://rust17.github.io/circle.github.io/read/2018/01/24/nginx-vhost-config.html)，在上回主要记录了如何在linux下的nginx配置多个站点，配置的站点是一个静态页面，这篇文章主要记录怎样部署一个包含php框架的项目，主要侧重于记录nginx的配置。<br>
<!-- more -->

项目文件目录结构:

![项目的文件目录](assets/example2.com.png)

首先，顺着上回已经部署好的项目，我利用的是已经创建好example2.com这个域名作为项目域名，修改一下配置文件如下：<br>

        server {
            listen 80;
            server_name example2.com www.example2.com;

            root apps/nginx/html/example2.com/web;
            index index.php index.html index.htm;

            location / {
                try_files $uri $uri/ /index.php?q=$uri&$args;
            }
            error_log  /apps/nginx/logs/example2_error.log;
            #error_page 404 /404.html;
            #error_page 500 502 503 504 /50x.html;
            location = /50x.html{
                root apps/nginx/html;
            }
            
            location ~\.php$ {
                try_files $uri = 404;
                fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
                fastcgi_index index.php;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include fastcgi_params;
            }
        }

修改了原配置文件的location模块配置：<br>

        location / {
            try_files $uri $uri/ /index.php?q=$uri&$args;
        }

网上搜了下，这个配置的大致的作用是匹配到所有的uri并尝试将其重定向到"uri/"这个目录下，如果文件不存在则将uri交给index.php处理。将这个配置文件修改保存，然后重启nginx生效：<br>

        nginx -s reload

浏览器打开：www.example2.com,发现报错了——file not found，打开错误日志example2_error.log，发现：<br>

        2018/01/26 16:58:48 [error] 13476#0: *159879 FastCGI sent in stderr: "Primary script unknown" while reading response header from upstream, client: xxx.xxx.xxx.xx, server: example2.com, request: "GET / HTTP/1.1", upstream: "fastcgi://127.0.0.1:9000", host: "example2.com"

提示无法使用fastcgi，fastcgi是用来处理php页面的东东，原因是php模块里的fastcgi地址写错了，将php的模块配置改为如下：<br>

        location ~ \.php$ {       
            root html/example2.com/web;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME /apps/nginx/html/example2.com/web$fastcgi_script_name;
            include  fastcgi_params;
        }

再次打开网址，发现报错——无法找到渲染模板，这个错是程序里面报的，在项目的错误日志里发现了以下错误：<br>

        [2018-01-29 10:29:21]无法找到渲染模板：_components/user/login[_components/user/login][Reffer:]

在example2_error.log里面发现：<br>

        2018/01/29 09:47:34 [error] 12373#0: *177896 open() "/web/_components/_components/user/login.html" failed (2: No such file or directory), client: xxx.xxx.xxx.xx, server: example2.com, request: "GET /_components/user/login.html?jump=http%3A%2F%2Fexample2.com%2Fmember%2Findex%2Findex HTTP/1.1", host: "example2.com"

很奇怪，为什么我访问_components/user/login.html会跳到/web/_components/_components/user/login.html呢，一开始我以为是location/{}把所有请求都交给index.php处理的缘故，于是我在配置文件里添加一个配置，不处理以.html结尾的文件:<br>

        location ~ \.html$ {
            root apps/nginx/html/example2.com/web;
        }

发现依旧报错：<br>

        2018/01/29 14:03:32 [error] 14605#0: *179878 open() "/apps/nginx/apps/nginx/html/example2.com/web/_components/user/_components/user/login.html" failed (2: No such file or directory), client: xxx.xxx.xxx.xx, server: example2.com, request: "GET /_components/user/login.html?jump=http%3A%2F%2Fexample2.com%2Fmember%2Findex%2Findex HTTP/1.1", host: "example2.com"

还是这个错，我以为我的配置写错了，网上搜了半天，将各种配置挨个试了一遍，依然是这个错，直到我快要崩溃的时候，我才意识到也许并不是这个配置的缘故，理解的方向错了，郁闷了半天又回到开始的问题：问什么会跳转到一个不存在目录？这个多出来的"/apps/nginx"到底是哪来的？想到这里，我记起了nginx主配置文件里有一个配置:<br>

        server{
            xxxxxx
            root /apps/nginx/html
            xxxxxx
        }

原来是主配置文件将所有请求都定义在"/apps/nginx/html"这个目录下了，终于找到了问题所在，修改项目配置文件example.com.conf:<br>

        server {
            listen 80;
            server_name example2.com www.example2.com;

            root html/example2.com/web;
            index index.php index.html index.htm;

            location ~ \.html$ {
                root html/example2.com/web;
            }  
            
            location / {
                root html/example2.com/web;
                try_files $uri $uri/ /index.php?q=$uri&$args;
            }
            #error_log  /apps/nginx/logs/example2_error.log;
            #error_page 404 /404.html;
            #error_page 500 502 503 504 /50x.html;
            location = /50x.html{
                root apps/nginx/html;
            }
            
            location ~ \.php$ {       
                root html/example2.com/web;
                fastcgi_pass 127.0.0.1:9000;
                fastcgi_index index.php;
                fastcgi_param SCRIPT_FILENAME /apps/nginx/html/example2.com/web$fastcgi_script_name;
                include  fastcgi_params;
            }
        }

去掉了所有的"/apps/nginx"，保存重启nginx，打开example2.com，成功了！由此可见，方向是多么的重要，理解错了方向会付出巨大的代价！