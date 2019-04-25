---
title: "[译] —— 队列任务：是怎样工作的"
layout: post
date: 2019-04-24 13:00
headerImage: false
tag:
- translation
- laravel
- queue
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 描述了 Laravel 队列的工作原理
---

现在，我们已经知道了 Laravel 将任务推送到不同的队列，让我们来深入了解工作人员是怎样执行任务的。首先，我将这里的工作人员定义为一个简单的 PHP 工作进程，该进程在后台运行，从存储空间中取出任务，小心翼翼地根据一些配置选项执行。

```shell
php artisan queue:work
```

执行这条命令将指示 Laravel 创建一个应用实例，然后开始执行任务，这个实例将一直保持着。也就意味着一旦这个命令执行了，Laravel 就会一直保持着启动，同时该实例还将被用于执行任务。也就是说：

* 避免了每次执行任务都要启动整个程序从而节省了服务器资源
* 在应用程序中任何代码的改动，你都必须要手动重启这个工员

你也可以执行：

```shell
php artisan queue:work --once
```

这个命令会将启动应用程序，执行一次任务，然后就结束掉整个脚本了。

```shell
php artisan queue:listen
```

`queue:listen` 命令会在循环运行期间执行 `queue:work --once` 命令，这个命令执行的过程如下：

* 每次循环启动一个应用程序实例
* 指派的工作进程将挑选一个任务并执行
* 结束该进程

使用 `queue:listen` 确保了每个任务都会诞生一个新的应用实例，这就意味着你如果改动代码也不必每次都去手动重启工作进程了，但也意味着更多的服务器资源将被消耗。


---
原文地址：[https://divinglaravel.com/queue-workers-how-they-work](https://divinglaravel.com/queue-workers-how-they-work)

作者：[Mohamed Said](https://twitter.com/themsaid)

---
