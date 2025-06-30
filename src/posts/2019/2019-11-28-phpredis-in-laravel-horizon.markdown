---
title: "laradock 添加队列监控"
layout: post
date: 2019-11-28 12:00
headerImage: false
tag:
- laravel-horizon
- phpredis
- docker
category: blog
hidden: false
author: circle
description: laradock laravel-horizon
---
最近在部署一个 laravel 项目到服务器的过程中遇到了一个问题。主要内容为：需要在一台运行着 laradock 的服务器上实现多个站点的队列监控。

---
laradock 使用 laravel-horizon 容器作为队列监控。在部署项目的过程中，混淆了队列监控与任务调度，一直以为是在 workspace 容器内的 crontab 中添加调度任务来启动队列监控，结果一直没有看到项目的队列监控的开启。

在弄清楚队列需要在 laravel-horizon 中配置后，开始在 laradock 的文档中寻找相关的内容，坑爹的是，在文档中完全没有找到相关的介绍。最后还是在 laradock 的 github 仓库内的一个 [issue][1] 有提到。大概如下：

```
# laravel-worker-site-1.conf

[program:laravel-worker]
progress_name=%(program_name)s_%(progress_num)02d
command=php /var/www/site-1/artisan queue:work --sleep=3 --tries=3 --daemon
autostart=true
autorestart=true
numprocs=8
user=laradock
redirect_stderr=true
```

```
# laravel-worker-site-2.conf

[program:laravel-worker]
progress_name=%(program_name)s_%(progress_num)02d
command=php /var/www/site-2/artisan queue:work --sleep=3 --tries=3 --daemon
autostart=true
autorestart=true
numprocs=8
user=laradock
redirect_stderr=true
```

可以看到，只需要为每个站点的监控配置相应的进程、执行命令以及一些相关的参数。

[1]: https://github.com/laradock/laradock/issues/2297