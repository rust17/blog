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

### queue:work 命令

让我们来看一下 `Queue\Console\WorkCommand` 这个类内部的 `handle()` 方法，当你运行 `php artisan queue:work` 的时候，执行的就是这个方法。

```php
public function handle()
{
    if ($this->downForMaintenance() && $this->option('once')) {
        return $this->worker->sleep($this->option('sleep'));
    }

    $this->listenForEvents();

    $connection = $this->argument('connection')
                    ?: $this->laravel['config']['queue.default'];

    $queue = $this->getQueue($connection);

    $this->runWorker(
        $connection, $queue
    );
}
```

首先，我们检查了程序是否处于维护模式以及命令行是否使用了 `--once` 参数，如果这两个条件都符合，那么我们希望脚本能优雅地终止，而不必再执行任何任务。为此，在终止整个脚本之前我们将让工作进程进行一段设定时间的睡眠。

`Queue\Worker` 的 `sleep()` 方法大概就是这个样子：

```php
public function sleep($seconds)
{
    sleep($seconds);
}
```

**在 handle() 方法中我们为什么不直接返回空来结束掉整个脚本呢？**

正如我们之前所说那样，`queue:listen` 命令是在一个循环内执行 `WorkCommand` 的：

```php
while (true) {
    // 这个过程只需要调用 —— 'php artisan queue:work --once'
    $this->runProgress($process, $options->memory);
}
```

如果程序处于维护阶段，`WorkCommand` 命令立即终止将会使得一次循环结束，并快速开启下一个工作进程。这比故意造成延迟要好得多，因为那样将会创建大量我们不需要的应用实例从而造成消耗过多的服务器资源。

### 监听事件

在 `handle()` 方法内部我们调用了 `listenForEvents()` 方法：

```php
protected function listenForEvents()
{
    $this->laravel['events']->listen(JobProcessing::class, function ($event) {
        $this->writeOutput($event->job, 'starting');
    });

    $this->laravel['events']->listen(JobProcessed::class, function ($event) {
        $this->writeOutput($event->job, 'success');
    });

    $this->laravel['events']->listen(JobFailed::class, function ($event) {
        $this->writeOutput($event->job, 'failed');

        $this->logFailedJob($event);
    });
}
```

在这个方法内部，我们监听了一系列工作进程会触发的事件，这将允许我们在每个事件处理、通过或者失败的阶段打印一些信息给用户。


---
原文地址：[https://divinglaravel.com/queue-workers-how-they-work](https://divinglaravel.com/queue-workers-how-they-work)

作者：[Mohamed Said](https://twitter.com/themsaid)

---
