---
title: "记录一次完整的网站部署流程"
layout: post
date: 2018-09-06 18:30
headerImage: false
tag:
- record
- deploy
category: ['blog', 'first']
author: circle
description: 网站部署流程
---

&emsp;&emsp;每一次，部署一个网站到线上服务器，总会出现一些奇奇怪怪的问题，例如代码拷贝错误、数据库迁移失败、`js`/`css`文件加载不了等等。导致每一次部署都得经过一番 XJB 折腾，折腾时间少则一天多则好几天。实在是没办法忍受这种折磨了，为了减少无谓的时间浪费，为了将时间充分地利用在写代码上，我决定是时候把一次完整的部署流程记录下来了。

---
### 拷贝代码到服务器

&emsp;&emsp;通常，我是利用 [deployphp](https://deployer.org/) 这样的工具将代码部署到服务器上，这样做的好处是：只需要一条命令就可以搞掂大部分工作，而且方便回滚。相当于免去了手动创建项目目录、 `git clone` 以及手动安装依赖等操作，顺序为：

```
以下在本地执行
```
* 在项目文件根目录下运行 `deploy init`，选择 `common`(通用)，会提示一些确认信息，只需要回车默认即可，执行成功将生成 `deploy.php` 文件
* 修改 `deploy.php` 文件中的几个地方

```php
// 设置代码仓库，用于拉取代码
set('repository', 'git@github.com:GITHUB ID/项目');

// 设置 git_tty 为 false 模式
set('git_tty', false);

// 设置版本之间共享的文件以及文件夹
set('shared_files', ['.env']);
set('shared_dirs', [
    'storage'
]);

// 这两句我也忘了是干啥了。。。
set('cleanup_use_sudo', true);
set('ssh_multiplexing', false);

// 配置服务器信息，服务器地址，免密码登录公钥，项目代码路径
host('111.230.206.231')
    ->user('deployer')
    ->identityFile('~/.ssh/deployerKey')
    ->set('deploy_path', '/var/www/laravel-shop');

// 如果需要设置 composer 安装 dev 中的依赖的话，则添加这句
set('composer_options', 'install --verbose --prefer-dist --no-progress --no-interaction --optimize-autoloader');
```
* 打开 `git bash`，在命令行窗口中输入 `dep deploy -vvv`，`-vvv` 代表了输出详细的安装过程，可以不写

&emsp;&emsp;正常来说，这样子代码已经成功地部署到了指定的路径当中，当然，前提是 deploy 安装没问题，配置没问题，有问题的话可以参考 [又一篇 Deployer 的使用攻略](https://overtrue.me/articles/2018/06/deployer-guide.html)。

### 配置域名

&emsp;&emsp;这个没什么好说的，就是到腾讯云或者阿里云控制台，将域名绑定到指定 ip 上。

### 新建数据库

&emsp;&emsp;同样没什么好说的，主要是新建一个数据库，记住库名字，后边要用。

### 配置 .env 文件
```
根目录下执行
```

* 将 `.env.example` 复制一份，并以 `.env` 命名
```bash
$ cp .env.example .env
```

* 修改一些列配置：应用名称 APP_NAME、域名 APP_URL、数据库即上面新建的库名 DB_DATABASE、登录用户名 DB_USERNAME、数据库密码 DB_PASSWORD

### 安装依赖

项目根目录下运行
```bash
composer install
```

* 生成 laravel key
```bash
$ php artisan key:generate
```

### 迁移数据库

&emsp;&emsp;配置好数据库的连接方式后，就可以执行数据库的迁移了。
```bash
根目录下执行
$ php artisan migrate
```

### 配置 Nginx

* 新建一个指定域名的 nginx 配置文件，格式如 example.com.conf，通常直接从别的项目中复制然后修改即可，需要注意的是要在 sites-avaliable 文件夹下进行。

```bash
sudo cp /etc/nginx/sites-avaliable example.com.conf /etc/nginx/sites-avaliable example2.com.conf

server{
        listen	80;
        server_name   example2.com www.example2.com; // 修改成对应的域名
        root        /var/www/example2.com/html; // 修改成项目的文件夹路径
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
```

* 创建软连接，在 sites-enabled 中创建 sites-avaliable 目录下文件的快捷方式

```bash
$ sudo ln -s /etc/nginx/sites-avaliable/example2.com.conf /etc/nginx/sites-enabled/example2.com.conf
```

### 重启 Nginx 和 php-fpm

```
systemctl nginx.service restart

service php-fpm restart
```

### 需要注意的地方

&emsp;&emsp;app.blade.php 文件中加载 css/js 文件的方法写成 `asset(dir/xx.js)`，同时将 `public/css` 和 `public/js` 文件夹加入版本控制，这样就不用到服务器上编译前端资源了。


总的来说，到这里就已经可以通过域名访问了，部署过程相对简单，只是步骤比较多，其中某一个环节出了问题会影响到其他环节，所以必须要确认每一步都没有出错。
