---
title: "在 laravel-horizon 中安装 phpredis"
layout: post
date: 2019-12-01 17:00
headerImage: false
tag:
- laravel
- docker
- phpredis
category: blog
hidden: false
author: circle
description: install phpredis in laravel-horizon docker
---
服务器采用 laradock 作为运行环境，需要为项目安装 phpredis 扩展，在 workspace 容器中安装并不管用，得在 laravel-horizon 容器内安装。
### 如何安装
在 laravel-horizon 中安装 phpredis，需要修改容器编排文件：
```
# docker-composer.yml

INSTALL_PHPREDIS=${LARAVEL_HORIZON_INSTALL_PHPREDIS}
```

```
# .env

LARAVEL_HORIZON_INSTALL_PHPREDIS=true
```

```
# laravel-horizon/Dockerfile

# Install PhpRedis package:
ARG INSTALL_PHPREDIS=false
RUN if [ ${INSTALL_PHPREDIS} = true ]; then \
    # Install Php Redis Extension
    printf "\n" | pecl install -o -f redis \
    &&  rm -rf /tmp/pear \
    &&  docker-php-ext-enable redis \
;fi
```

修改好后，需要重新编译
```
docker-compose build --no-cache laravel-horizon
```
编译完之后，关掉原来的服务，再启动
```
docker-compose down laravel-horizon
docker-compose up -d laravel-horizon
```
### 如何验证
1. 进入 laravel-horizon 容器 
```
d exec -it $(d ps | grep horizon | awk '{print $1}') sh
```
2. 查看 php 扩展有没有开启 redis
```
php -m | grep redis
```
结果如果输出 `reids`，便代表安装成功