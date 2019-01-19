---
layout: post
category: ['blog', '2018']
title:  "Linux nginx 配置多站点"
tags: [php,nginx,linux]
---
<br>

最近在给一个客户做项目，需要在客户的服务器上部署，客户的服务器搭建好的环境是lnmp，由于平时无论在本地还是线上接触的都是apache，对nginx了解的是知之甚少，正好趁这个机会学习nginx。项目在本地测试好后，打算部署到客户的服务器上，结果配置了好久，中间又穿插着其他的一些事情，部署了将近一周，终于可以顺利访问了，这里总结一下。<br>
<!-- more -->
>问题：nginx配置多站点访问是如何实现的？<br>

之前接触过利用了apache的配置文件httpd.conf包含extra/vhosts/站点配置文件(xxx.com.conf)，也就是一台服务器部署了多个项目，绑定多个域名，根据访问域名的不同指向相应的文件目录。从网上了解到，这样的模式在nginx上也是可以实现的，在一台自己的服务器上测试，大致步骤如下：<br>

1.安装好nginx<br>

        sudo yum install nginx

2.创建目录结构，这里说明下我的项目是放在/var/www/这个目录下<br>

        sudo mkdir -p /var/www/example.com/html
        sudo mkdir -p /var/www/example2.com/html

接着赋予项目根目录可读写的权限，
		
        sudo chomd -R 777 /var/www

3.为每一个站点新建一个demo页面，这里主要是为了实现效果，所以写了一个非常简单的静态页面

        nano /var/www/example.com/html/index.html

页面的代码如下

        <html>
          <head>
             <title>Welcome to Example.com!</title>
          </head>
          <body>
             <h1>Hello World!</h1>
          </body>
        </html>

直接复制这个页面作为example2.com

        cp /var/www/example.com/html/index.html /var/www/example2.com/html/index.html

修改页面2稍作调整，以便区分

        nano /var/www/example2.com/html/index.html

        <html>
          <head>
             <title>Welcome to Example2.com!</title>
          </head>
          <body>
             <h1>Hello World 2!</h1>
          </body>
        </html>

4.在nginx目录下创建服务模块文件，这里将创建两个目录，一个用来保存所有的服务配置文件，另一个用来链接到这些配置文件

        sudo mkdir /etc/nginx/sites-available
        sudo mkdir /etc/nginx/sites-enabled

为了将这些配置文件添加进nginx作为vhost站点的配置文件,需要在nginx配置文件下添加

        sudo nano /etc/nginx/nginx.conf

        include /etc/nginx/sites-enables/*.conf;

接着，创建第一个站点配置文件，这里直接将默认配置文件复制即可

        sudo cp /etc/nginx/conf.d/defaul.conf /etc/nginx/sites-available/example.com.conf

        sudo nano /etc/nginx/sites-available/example.com.conf

我的配置文件是这样的:
    
        server{
                listen	80;
                server_name   example.com www.example.com;
                root        /var/www/example.com/html;
                index index.php index.html index.htm;

            location / {
                try_files $uri $uri/ = 404;
            }

            error_page 404 /404.html;
            error_page 500 502 503 504 /50x.html;
            location = /50x.html{
                root /usr/share/nginx/html;
            }

            location ~\.php$ {
                try_files $uri = 404;
                fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
                fastcgi_index index.php;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include fastcgi_params;
            }
        }

第二个站点的配置文件，直接复制稍作修改即可

        sudo cp /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-available/example2.com.conf

        server{
                listen	80;
                server_name   example2.com www.example2.com;
                root        /var/www/example2.com/html;
                index index.php index.html index.htm;

            location / {
                try_files $uri $uri/ = 404;
            }

            error_page 404 /404.html;
            error_page 500 502 503 504 /50x.html;
            location = /50x.html{
                root /usr/share/nginx/html;
            }

            location ~\.php$ {
                try_files $uri = 404;
                fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
                fastcgi_index index.php;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include fastcgi_params;
            }
        }

5.创建软连接，将sites-enabled目录链接到sites-available目录下的配置文件

        sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf
        sudo ln -s /etc/nginx/sites-available/example2.com.conf /etc/nginx/sites-enabled/example2.com.conf

6.在本地电脑将这两个域名绑定到测试服务器的ip上，这样就能在本地访问了

        127.0.0.1   localhost
        server_ip_address example.com
        server_ip_address example2.com

7.打开浏览器，分别输入example.com和example2.com，看到如下信息，表明已经成功创建了两个站点:

        Hello World!

        Hello World 2!

到这里，已经基本弄清楚nginx下，配置多个站点是如何实现的了，以及配置文件的基本配置信息所代表的意思，参考了Josh Barnett大大的文章，非常感谢：<br>
<https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-on-centos-7>
